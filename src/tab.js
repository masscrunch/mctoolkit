/**
 * @author DK
 * @date 2013-5-7 
 */
define('tab', function(require, exports, module){
	var tools = require('./tools');

	var Tab = function(options){
		this._initTab(options);
	}
	
	Tab.prototype = {
		_initTab: function(options){
			this.options = tools.mix({
				s_container: '',
				s_tab: '',
				s_content: '',
				fireevent: 'click',
				selectClass: 'select',
				ontabselect: function(e){},
				onshow: function(e){},
				closeable: false
			}, options);
			this.selectedIndex = 0;
			this._initTabUI();
			this._initTabEvents();
		},
		
		_initTabUI: function(){
			$(this.options.s_container).find(this.options.s_tab).each(function(index){
				this.tabindex = index;
			});
			$(this.options.s_container).find(this.options.s_content).hide();
			this.show(this.selectedIndex);
		},
		
		_initTabEvents: function(){
			var self = this;
			$(this.options.s_container).find(this.options.s_tab).bind(this.options.fireevent, function(e){
				var index = this.tabindex;
				self.options.ontabselect({index: index});
				if(!self.options.closeable){
					self.show(index);
				}else{
					if(index == self.selectedIndex && $(self.options.s_container).find(self.options.s_tab + ':eq(' + self.selectedIndex + ')').hasClass(self.options.selectClass)){
						self.hide(index);
					}else{
						self.show(index);
					}
				}
			});
		},
		
		show: function(index){
			$(this.options.s_container).find(this.options.s_tab + ':eq(' + this.selectedIndex + ')').removeClass(this.options.selectClass);
			$(this.options.s_container).find(this.options.s_tab + ':eq(' + index + ')').addClass(this.options.selectClass);
			$(this.options.s_container).find(this.options.s_content + ':eq(' + this.selectedIndex + ')').hide();
			$(this.options.s_container).find(this.options.s_content + ':eq(' + index + ')').show();
			var event = {
				prevIndex: this.selectedIndex,
				index: index
			}
			this.selectedIndex = index;
			this.options.onshow(event);
		},

		hide: function(index){
			$(this.options.s_container).find(this.options.s_tab + ':eq(' + this.selectedIndex + ')').removeClass(this.options.selectClass);
			// $(this.options.s_container).find(this.options.s_tab + ':eq(' + index + ')').addClass(this.options.selectClass);
			$(this.options.s_container).find(this.options.s_content + ':eq(' + this.selectedIndex + ')').hide();
			// $(this.options.s_container).find(this.options.s_content + ':eq(' + index + ')').show();
		}

	};
	
	var tab = function(options){
		var containers = $(options.s_container);
		var tabs = [];
		containers.each(function(index){
			var newOptions = {};
			for(var key in options){
				newOptions[key] = options[key];
			}
			newOptions.s_container = options.s_container + ':eq(' + index + ')';
			tabs.push(new Tab(newOptions));
		});
		return tabs;
	};
module.exports = tab;	
})
