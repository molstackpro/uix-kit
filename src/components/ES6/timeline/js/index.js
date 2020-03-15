
/* 
 *************************************
 * <!-- Timeline -->
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


import '../scss/_style.scss';


export const TIMELINE = ( ( module, $, window, document ) => {
	if ( window.TIMELINE === null ) return false;
	
	

    module.TIMELINE               = module.TIMELINE || {};
    module.TIMELINE.version       = '0.1.6';
    module.TIMELINE.pageLoaded    = function() {

        const $window          = $( window );
        let	windowWidth        = window.innerWidth,
            windowHeight       = window.innerHeight;
				

		/*! 
		 ---------------------------
         Horizontal Timeline
		 ---------------------------
		 */
		if ( windowWidth > 768 ) {
			$( '.uix-timeline__container-wrapper.is-horizontal' ).each( function()  {

				const $this          = $( this );
                
				const $container     = $this.find( '.uix-timeline__container.is-horizontal' ),
					  $timeline      = $container.find( '> .uix-timeline' );
                
				let	  dateShowEle    = $timeline.data( 'show-ele' );

				if ( typeof dateShowEle === typeof undefined ) {
					dateShowEle = '#timeline-number-show';
				}	
		
			

				$this.find( '.uix-timeline__btn--prev' ).off( 'click' ).on( 'click', function( e ) {
					e.preventDefault();
					timelineUpdate( $this, false, dateShowEle, true );
					return false;
				});

				$this.find( '.uix-timeline__btn--next' ).off( 'click' ).on( 'click', function( e ) {
					e.preventDefault();
					timelineUpdate( $this, false, dateShowEle, false );
					return false;
				});

				$this.find( '.uix-timeline__item .uix-timeline__item--img' ).off( 'click' ).on( 'click', function( e ) {
					e.preventDefault();
					timelineUpdate( $this, $( this ).parent(), dateShowEle, false );
					return false;
				});

				
				//Activate the default selection
				timelineUpdate( $this, $this.find( '.uix-timeline__item.is-active' ), dateShowEle, false );
				if ( $this.find( '.uix-timeline__item.is-active' ).index() == 0 ) {
					$this.find( '.uix-timeline__btn--prev' ).addClass( 'is-disabled' );
				}
				

				
				if ( $this.hasClass( 'is-reversed' ) ) {
					
					// Set equal heights
					const setEqualHeights = function( el ) {
						let counter = 0;

						for ( let i = 0; i < el.length; i++) {

							const singleHeight = $( el[i] ).outerHeight( true );

							if (counter < singleHeight) {
								counter = singleHeight;
							}
						}

						for ( let k = 0; k < el.length; k++) {
							$( el[k] ).css( 'height', counter + 'px' );
						}

						return counter;

					};
					
					const infoNewHeight = setEqualHeights( $timeline.find( '.uix-timeline__item--info' ) );
					
					
			
					// Reset container height
					$container.css( {
						'padding' : parseFloat( infoNewHeight + 64 ) + 'px 0'
					} );	
				}


				
				
			});	
		}
		
		

		/*
		 * Method that updates items of timeline
		 *
		 * @param  {Element} obj                  - Wrapper of timeline.
		 * @param  {?Element} iscur                - The current item.
		 * @param  {String} showEle              - Element ID or class name that push the current text.
		 * @param  {Boolean} prev                - Whether to slide forward.
		 * @return {Void}
		 */
		function timelineUpdate( obj, iscur, showEle, prev ) {
			const itemTotal  = obj.find( '.uix-timeline__item' ).length,
				  tNav       = obj.find( '.uix-timeline__item' ),
				  tLoop      = false;
			
			
			let curIndex = obj.find( '.uix-timeline__item.is-active' ).index(),
				tarIndex;

			//Check if a value is an object currently
			if ( iscur && typeof iscur === 'object' ) {
				curIndex = iscur.index();
				tarIndex = curIndex;
			} else {
				
				if ( prev ) {
					tarIndex = ( curIndex >= 0  ) ? curIndex-1 : 0;
				} else {
					tarIndex = ( curIndex < itemTotal  ) ? curIndex+1 : itemTotal-1;
				}
				
			}
			
			
		
			
			//loop the items
			obj.find( '.uix-timeline__btn--prev, .uix-timeline__btn--next' ).removeClass( 'is-disabled' );
			
			if ( prev ) {
				
				//Previous
				if ( tLoop ) {
					if ( tarIndex < 0 ) tarIndex = itemTotal-1;
				} else {
					if ( tarIndex < 0 ) tarIndex = 0;
					if ( tarIndex == 0 ) obj.find( '.uix-timeline__btn--prev' ).addClass( 'is-disabled' );
					
					 
				}
			} else {
				
				//Next
				if ( tLoop ) {
					if ( tarIndex == itemTotal ) tarIndex = 0;
				} else {
					if ( tarIndex > itemTotal-1 ) tarIndex = itemTotal-1;
					if ( tarIndex > itemTotal-2 ) obj.find( '.uix-timeline__btn--next' ).addClass( 'is-disabled' );
					if ( tarIndex == 0 ) obj.find( '.uix-timeline__btn--prev' ).addClass( 'is-disabled' );
				}
			}

			
			
			tNav.removeClass( 'is-active' );
			obj.find( '.uix-timeline__item:eq('+tarIndex+')' ).addClass( 'is-active' );

			//scroll left
			let tNavW = 0;
			for ( let i = 0; i < tarIndex; i++ ) {
				tNavW += obj.find( '.uix-timeline__item:eq('+i+')' ).width();
			}
	
			obj.find( '.uix-timeline__container.is-horizontal > .uix-timeline' ).css({
				'margin-left' : -parseFloat( tNavW ) + 'px'
			});
			
			//Push the current text to element 
			$( showEle ).text( obj.find( '.uix-timeline__item:eq('+tarIndex+')' ).find( '.uix-timeline__item--date' ).text() );
			
			
		}
    
		
    };

    module.components.pageLoaded.push( module.TIMELINE.pageLoaded );

	return class TIMELINE {
		constructor() {
			this.module = module;
		}
		
	};
	
})( UixModuleInstance, jQuery, window, document );




