var allSources=['random','weather','zero','one','cliff','bitcoin','sinSlow'];

var fuckingBitcoin=.5;
var weather = function(tid) {
	var result=0;
	$.ajax({                                                                                                                                                                                                        
    type: 'GET',                                                                                                                                                                                                 
    url: 'http://api.openweathermap.org/data/2.5/weather?q=Atlanta,GA',                                                                                                                                              
    dataType: 'jsonp',
            async:false,                                                                                                                                                                                       
    success: function(data) { 
	result=(data.main.temp-data.main.temp_min)/data.main.temp_max;
	console.log(result);
    	
    },                                                                                                                                                                                       
    error: function() { console.log('Uh Oh!'); }     
                                                                                                                                             
});

	return result;

}
var cliff = function(tid) {
	return (tick%100/100);

  };

var random = function(tid) {
	return Math.random();
  };
  
var bitcoin = function(tid) {
var fin=0.1;
$.ajax({                                                                                                                                                                                                        
    type: 'GET',                                                                                                                                                                                                 
    url: 'https://btc-e.com/api/3/ticker/btc_usd',                                                                                                                                              
    dataType: 'jsonp',
            async:false,                                                                                                                                                                                       
    success: function(resp) { 
    	fin=(resp.btc_usd.last-resp.btc_usd.low)/(resp.btc_usd.high-resp.btc_usd.low);
    	
    	fuckingBitcoin=fin;
		console.log(fuckingBitcoin);
    	
    },                                                                                                                                                                                       
    error: function() { console.log('Uh Oh!'); }                                                                                                                                            
});

		return fuckingBitcoin;
};


var zero = function(tid) {
	return 0;
  };
  
  


var one = function(tid) {
	return 1;
  };
  

var sinSlow = function(tid) {
	return (Math.sin((tick%100/100)*2*Math.PI)+1)/2;
  };