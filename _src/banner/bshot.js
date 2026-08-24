const {chromium} = require('/Users/jarvis/clawd/node_modules/playwright');
(async()=>{
  const b=await chromium.launch();
  const p=await b.newPage({viewport:{width:1200,height:806},deviceScaleFactor:2});
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.goto('file://'+process.argv[2],{waitUntil:'networkidle'});
  const ok=await p.evaluate(()=>[...document.images].every(i=>i.naturalWidth>0));
  console.log('all images loaded:',ok,'errors:',errs);
  await p.screenshot({path:process.argv[3],type:'jpeg',quality:90});
  await b.close();
})();
