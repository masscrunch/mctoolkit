define('rwd-picture', function(require, exports, module){
	var RWDPicItem = function(target){
		this._initRWDPicItem(target);
	};

	RWDPicItem.prototype = {
		_initRWDPicItem: function(target){
			var spans = $(target).find('span');

			this.max = null;
			this.min = null;
			this.current = null;
			this.currentWidth = null;
			this.sizeList = [];
			var self = this;
			this.mediaList = {};

			spans.each(function(){
				var media = this.getAttribute('data-media');
				var mediaWidth = parseInt(/\d+/.exec(media)[0]);
				self.sizeList.push(mediaWidth);
				if(self.max == null){
					self.max = mediaWidth;
				}else{
					if(self.max < mediaWidth){
						self.max = mediaWidth;
					}
				}

				if(self.min == null){
					self.min = mediaWidth;
				}else{
					if(self.min > mediaWidth){
						self.min = mediaWidth;
					}
				}

				self.mediaList[mediaWidth] = {};
				self.mediaList[mediaWidth].span = this;
				self.mediaList[mediaWidth].loaded = false;
			});


			this.sizeList.sort(function(a, b){
				return a > b;
			});
		},
		showMin: function(){

		},
		respond: function(width){
			var self = this;
			if(width < this.min){
				width = this.min;
			}
			var mediaWidth = this.getMediaWidth(width);

			if(mediaWidth == this.currentWidth){
				return;
			}

			(this.currentWidth === null) || $(this.mediaList[this.currentWidth].img).hide();
			this.currentWidth = mediaWidth;

			if(this.mediaList[mediaWidth].loaded){
				$(this.mediaList.img).show();
			}else{
				var img = new Image();
				img.src = this.mediaList[mediaWidth].span.getAttribute('data-src');
				this.mediaList[mediaWidth].img = img;
				this.mediaList[mediaWidth].span.appendChild(img);
				this.mediaList[mediaWidth].loaded = true;
			}
		},

		getMediaWidth: function(width){
			for(var i = 0, len = this.sizeList.length; i < len; i++){
				if(width < this.sizeList[i]){
					break;
				}
			}
			return this.sizeList[i - 1];
		}
	};


	var rwdpictures = [];

	$('span[data-picture]').each(function(){
		rwdpictures.push(new RWDPicItem(this));
	});


	var parseImage = function(){
		var width = window.innerWidth || $(document).width();
		for(var i = 0, len = rwdpictures.length; i < len; i++){
			rwdpictures[i].respond(width);
		}
	};
	parseImage();
	$(window).resize(parseImage); 
});