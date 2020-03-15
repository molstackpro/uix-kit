
/* 
 *************************************
 * <!-- Scroll Reveal -->
 *************************************
 */
import {
    templateUrl,
    homeUrl,
    ajaxUrl,
    browser,
    UixModuleInstance,
    UixGUID,
    UixMath,
    UixCssProperty
} from '@uixkit/core/_global/js';


export const SCROLL_REVEAL = ( ( module, $, window, document ) => {
	if ( window.SCROLL_REVEAL === null ) return false;
	
	
    module.SCROLL_REVEAL               = module.SCROLL_REVEAL || {};
    module.SCROLL_REVEAL.version       = '0.1.2';
    module.SCROLL_REVEAL.documentReady = function( $ ) {

		
		let viewport;
		
		//From JSON config in data attribute in HTML
		const $scrollRevealElements = $( '[data-uix-anim]' ),
			tmAnim = function( obj, type ) {

				let config = obj.data( 'uix-anim' );

				if( typeof config === typeof undefined || config == '' || config === false ) {
					config = {
						"from"     : {"opacity":0,"x":70},
						"to"       : {"opacity":1,"x":0},
						"ease"     : "Power2.easeOut",
						"duration" : 0.4,
						"delay"    : 0,
						"infinite" : false,
						"viewport" : '100%' //A percentage of the viewport's height.
					};
				}
				
			
				//get attributes to tweenMax
				let fromCSS     = config.from,
					toCSS       = config.to,
					myEase      = config.ease,
					myDuration  = config.duration,
					myDelay     = config.delay,
					infinite    = config.infinite;
				
				//A percentage of the viewport's height.
				viewport = config.viewport;
				
                
                if ( typeof viewport === typeof undefined ) viewport = '100%';
                if ( typeof myEase === typeof undefined ) myEase = 'Power2.easeOut';
                if ( typeof myDelay === typeof undefined ) myDelay = 0;
                if ( typeof myDuration === typeof undefined ) myDuration = 0.4;
                if ( typeof infinite === typeof undefined ) infinite = false;


                //Return a value
                if ( type == 'viewport' ) return viewport;
                if ( type == 'delay' ) return myDelay;
                if ( type == 'loop' ) return ( infinite ) ? 1 : 0;

				
				if( Object.prototype.toString.call( fromCSS ) == '[object String]' ) {
					//Add class when element becomes visible
					
					toCSS = toCSS.replace(/\./, '' );
					
					if ( type == 'from' ) obj.removeClass( toCSS );

					if ( type == 'from-anim' ) obj.removeClass( toCSS );

					//Target animation
                    if ( type == 'to' ) {

                        setTimeout( function(){
                            obj.addClass( toCSS );
                        }, myDelay*1000 );

                    }


					
				} else {
					//Using TweenMax to create animations
					if ( type == 'from' ) {
						TweenMax.set( obj, {
							css        : fromCSS
						});	

					}

					if ( type == 'from-anim' ) {
						TweenMax.to( obj, myDuration, {
							css        : fromCSS
						});	

					}

					//Target animation
					if ( type == 'to' ) {

						TweenMax.to( obj, myDuration, {
							css    : toCSS,
							ease   : myEase,
							delay  : myDelay
						});		


					}	


					
				}
	
				

			};


		$scrollRevealElements.each( function()  {
			
			//Prevent asynchronous loading of repeated calls
			const actived = $( this ).data( 'activated' );
			
			if( typeof actived === typeof undefined ) {
				tmAnim( $( this ), 'from' );

			}
			
		});

		
					
		//Prevent the location of page elements from being loaded incorrectly
		//Invoking a jQuery function after .each() has completed
		setTimeout( function() {
		
			const waypoints = $scrollRevealElements.waypoint({
				handler: function( direction ) {

					
					//Prevent asynchronous loading of repeated calls
					const actived = $( this.element ).data( 'activated' ),
						tmLoop  = tmAnim( $( this.element ), 'loop' );
					

					if( typeof actived === typeof undefined && tmLoop != 1 ) {
						
						//$( this.element ).toggleClass( 'animated fadeInUp', direction === 'down' );
						tmAnim( $( this.element ), 'to' );

						$( this.element ).data( 'activated', 1 );

						
					}
					
					if ( tmLoop === 1 ) {
						if ( direction === 'up' ) {
							tmAnim( $( this.element ), 'from-anim' );
						} else {
							tmAnim( $( this.element ), 'to' );
						}
					}	
					



				},
				offset: viewport //0~100%, bottom-in-view
			});
	
		}, 500 );
		
    };

    module.components.documentReady.push( module.SCROLL_REVEAL.documentReady );
	

	return class SCROLL_REVEAL {
		constructor() {
			this.module = module;
		}
		
	};
	
})( UixModuleInstance, jQuery, window, document );

