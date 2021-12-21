const { connect, close, setShuffle, fadeToBrightness, setScene, currentBrightness } = require('./minimad');

connect('192.168.1.178');

(async ()=>{
	await setShuffle(false);
	await fadeToBrightness(0.0);
	while(1){
		await setScene(1);
		await fadeToBrightness(1.0);
		await fadeToBrightness(0.0);
		await setScene(0);
		await fadeToBrightness(1.0);
		await fadeToBrightness(0.0);
	}
})();

process.on('SIGINT', () => {
  close();
  process.exit();
});
