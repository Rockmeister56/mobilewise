const fs=require('fs');
const html=fs.readFileSync('/home/claude/work/b2b-referral-builder.html','utf8');
const log=console.log.bind(console);
let pass=0,fail=0;
const t=(n,c,x)=>{c?(pass++,log('  PASS  '+n)):(fail++,log('  FAIL  '+n+(x?'\n        '+x:'')));};

log('\n── the two projects stay apart ──');
t('leads still come from VidGuide', /SB_URL\s*=\s*"https:\/\/fcgbusobfdwnpoqyuzoe/.test(html));
t('territories come from LocalHome', /LH_URL \+ '\/rest\/v1\/localhome_territories/.test(html));
const terrFetch=(html.match(/async function loadTerritories[\s\S]*?\n\}/)||[''])[0];
t('territory fetch never touches SB_URL', !/SB_URL/.test(terrFetch));
t('territory fetch uses LH_KEY only',     /LH_KEY/.test(terrFetch) && !/SB_KEY/.test(terrFetch));
t('no write to the leads table',          !/method:\s*'(POST|PATCH|DELETE)'/.test(terrFetch));

log('\n── both render paths filter the same way ──');
t('two filter sites patched', (html.match(/leadInTerritory\(l, terrF\)/g)||[]).length===2,
  String((html.match(/leadInTerritory\(l, terrF\)/g)||[]).length));
const exp=(html.match(/async function exportForEmail[\s\S]*?\n\}/)||[''])[0];
t('the email export filters too', /leadInTerritory/.test(exp));

// ── run the matcher ──
const src=(html.match(/function normCity[\s\S]*?\n\}/)||[''])[0]
        + '\n' + (html.match(/function leadInTerritory[\s\S]*?\n\}/)||[''])[0];
let TERR_BY_CITY={};
eval(src);
TERR_BY_CITY={
  'irvine':{key:'11',label:'Central'}, 'tustin':{key:'11',label:'Central'},
  'san clemente':{key:'10',label:'South'}, 'costa mesa':{key:'12',label:'North'}
};

log('\n── matching leads to territories ──');
t('Irvine -> Central',        leadInTerritory({city:'Irvine'},'11'));
t('Irvine is not South',     !leadInTerritory({city:'Irvine'},'10'));
t('trailing space still matches', leadInTerritory({city:'  Irvine '},'11'));
t('case does not matter',    leadInTerritory({city:'IRVINE'},'11'));
t('double space normalised', leadInTerritory({city:'San  Clemente'},'10'));
t('blank territory shows all', leadInTerritory({city:'Bakersfield'},''));

log('\n── the off-map bucket ──');
t('unmapped city is "not in any"',  leadInTerritory({city:'Bakersfield'},'__none__'));
t('a mapped city is not',          !leadInTerritory({city:'Irvine'},'__none__'));
t('no city at all counts as off-map', leadInTerritory({city:null},'__none__'));
t('and is not in a real territory', !leadInTerritory({city:null},'11'));
t('empty string too',               leadInTerritory({city:''},'__none__'));

log('\n── failing gracefully ──');
t('hides itself if territories unavailable', /sel\.style\.display = 'none'/.test(terrFetch));
t('warns rather than throwing', /console\.warn\('\[builder\] territories unavailable/.test(terrFetch));
t('hides when there are none',  /if \(!TERR_LIST\.length\) \{ sel\.style\.display = 'none'; return; \}/.test(terrFetch));
t('renderLeads survives a missing dropdown',
  /\(document\.getElementById\('territoryFilter'\) \|\| \{\}\)\.value/.test(html));

log('\n── the city dropdown follows the territory ──');
const bcf=(html.match(/function buildCityFilter[\s\S]*?\n\}/)||[''])[0];
t('narrows to the territory', /\(TERR_BY_CITY\[normCity\(c\)\] \|\| \{\}\)\.key === picked/.test(bcf));
t('off-map shows unmapped cities', /picked === '__none__'/.test(bcf));
t('keeps the chosen city if still valid', /if \(cities\.indexOf\(keep\) !== -1\) sel\.value = keep/.test(bcf));
t('changing territory clears the city', /document\.getElementById\('cityFilter'\)\.value = '';/.test(html));

log('\n── grouped so two "North"s stay apart ──');
t('optgroup per chapter', /<optgroup label="/.test(terrFetch));
t('city count shown per territory', /\+ ' \(' \+ t\.cities\.length \+ '\)<\/option>'/.test(terrFetch));

log('\n'+(fail?'FAILED '+fail:'ALL PASS')+'  ('+pass+' assertions)');
process.exit(fail?1:0);
