const {chromium} = require('/Users/jarvis/clawd/node_modules/playwright');
(async()=>{
  const b = await chromium.launch();
  const p = await b.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
  await p.goto('file://'+process.argv[2],{waitUntil:'networkidle'});
  await p.screenshot({path:process.argv[3]});
  await b.close(); console.log('rendered '+process.argv[3]);
})();
