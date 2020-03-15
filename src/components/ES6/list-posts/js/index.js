
/* 
 *************************************
 * <!-- Posts List With Ajax -->
 *************************************
 */

/**
 * module.POST_LIST_AJAX 
 * 
 * @requires ./examples/assets/js/min/template7.min.js
 * @requires ./examples/assets/js/min/muuri.min.js
 * @requires ./src/components/ES5/_plugins-Miscellaneous
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
import UixApplyAsyncScripts from '@uixkit/core/_global/js/fn/UixApplyAsyncScripts';


import '../scss/_basic.scss';
import '../scss/_split.scss';


export const POST_LIST_AJAX = ( ( module, $, window, document ) => {
	if ( window.POST_LIST_AJAX === null ) return false;
	
	
	
    module.POST_LIST_AJAX               = module.POST_LIST_AJAX || {};
    module.POST_LIST_AJAX.version       = '0.1.2';
    module.POST_LIST_AJAX.documentReady = function( $ ) {

		$( '[data-ajax-list-json]' ).each( function() {
			const $this            = $( this );
            
			const wrapperID        = 'refresh-all-waypoint-' + UixGUID.create();
            
			let    curPage          = $this.data( 'ajax-list-page-now' ),
				perShow          = $this.data( 'ajax-list-page-per' ),
				totalPage        = $this.data( 'ajax-list-page-total' ),
				method           = $this.data( 'ajax-list-method' ),
				trigger          = $this.data( 'ajax-list-trigger' ),
				infinitescroll   = $this.data( 'ajax-list-infinitescroll' ),
				jsonFile         = $this.data( 'ajax-list-json' ),
				render           = $this.data( 'ajax-list-render' ),
				template7ID      = $this.data( 'ajax-list-temp-id' ),
				pushContainer    = $this.data( 'ajax-list-push-container-class' ),
				triggerActive    = $this.data( 'ajax-list-trigger-active-class' ),
				pageParmStr      = $this.data( 'ajax-list-page-parm-str' ),
				noneInfo         = $this.data( 'ajax-list-none-info' );
	
			
			

			$this.attr( 'id', wrapperID );
			
			

			if( typeof pageParmStr === typeof undefined ) {
				pageParmStr = {
					'totalPage'     : 'total',
					'currentPage'   : 'page',
					'displayPerPage': 'per'
				};
			}
			
			if( typeof curPage === typeof undefined ) {
				curPage = 1;
			}
			
			
			if( typeof perShow === typeof undefined ) {
				perShow = 8;
			}
			
			if( typeof totalPage === typeof undefined ) {
				totalPage = 3;
			}
			
			if( typeof totalPage != typeof undefined && totalPage == '-1' ) {
				totalPage = 9999;
			}
			
			
			if( typeof trigger === typeof undefined ) {
				trigger = '.uix-load-more';
			}
			
			if( typeof infinitescroll === typeof undefined ) {
				infinitescroll = false;
			}	
			
			if( typeof render === typeof undefined ) {
				render = 'before';
			}			
			
			
			if( typeof jsonFile === typeof undefined ) {
				jsonFile = '';
			}		
			
			if( typeof template7ID === typeof undefined ) {
				template7ID = '';
			}	
			if( typeof triggerActive === typeof undefined ) {
				triggerActive = 'wait';
			}		
			
			if( typeof method === typeof undefined ) {
				method = 'POST';
			}		
			if( typeof noneInfo === typeof undefined ) {
				noneInfo = '{"none":"","error":""}';
			}
			
			
			
			triggerActive = triggerActive.replace( '.', '' );
			
			
			
			if( typeof pushContainer === typeof undefined ) {
				pushContainer = '.uix-ajax-items__container';
				
				if ( $this.find( pushContainer ).length == 0 ) {
					$( '#' + template7ID ).after( '<div class="uix-ajax-items__container"></div>' );
				}
				
			}		
			
			
			
			//Get all attributes of an element and push the new attributes like "data-*"
			let curAttrs        = $this.attr(),
				defaultPostData = '',
				customPostData  = '';
			
			$.each( curAttrs, function( i, val ) {
				if ( i.indexOf( 'data-ajax-list-field-' ) >= 0 ) {
					customPostData += '"' + i.replace( 'data-ajax-list-field-', '' ) + '": ' + '"' + val + '", ';	
				}
				
			});
			customPostData  = customPostData.replace(/,\s*$/, '' );
			

		
			
			//Parse the JSON data
			if ( jsonFile != '' && template7ID != '' ) {
				
				
				
				//Default output of the first page
				if ( curPage == 2 ) {

					//Perform dynamic loading
					if ( customPostData != '' ) {
						defaultPostData = JSON.parse( '{ "'+pageParmStr.totalPage+'": '+totalPage+', "'+pageParmStr.displayPerPage+'": '+perShow+', "'+pageParmStr.currentPage+'": 1, '+customPostData+' }' );
					} else {
						defaultPostData = JSON.parse( '{ "'+pageParmStr.totalPage+'": '+totalPage+', "'+pageParmStr.displayPerPage+'": '+perShow+', "'+pageParmStr.currentPage+'": 1 }' );
					}


					ajaxLoadInit( $this, defaultPostData, $( trigger ), curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, render, noneInfo );
				}
				
				
				
				
				if ( infinitescroll ) {
					/* 
					 ---------------------------
					 Infinite scroll
					 ---------------------------
					 */ 	
					const $button = $( trigger ),
						  btnTop  = $button.offset().top;
					
					//Add default page number to the button
					$button.attr( 'data-cur-page', 1 );

					
					//Hide the next button 
					if ( totalPage == 1 ) {
						$button.addClass( 'is-hide' );	
					}
					
				
						
					$( window ).on( 'scroll.POST_LIST_AJAX touchmove.POST_LIST_AJAX', function() {
						
						const scrolled = $( window ).scrollTop();
						
						if ( scrolled >= parseFloat( $button.offset().top - $( window ).height()/1.5 - $button.outerHeight( true ) ) && !$button.hasClass( triggerActive ) ) {

								// Active this button
								$button.addClass( triggerActive );					    
							
								let curPage = $button.attr( 'data-cur-page' );
							
								//Add next page number to the button
								curPage = parseFloat( curPage ) + 1;
								$button.attr( 'data-cur-page', curPage );
							
							    //Avoid touching the same button multiple times
							    if ( curPage == totalPage + 1 ) return false;
							
								//Perform dynamic loading
								if ( customPostData != '' ) {
									defaultPostData = JSON.parse( '{ "'+pageParmStr.totalPage+'": '+totalPage+', "'+pageParmStr.displayPerPage+'": '+perShow+', "'+pageParmStr.currentPage+'": '+curPage+', '+customPostData+' }' );
								} else {
									defaultPostData = JSON.parse( '{ "'+pageParmStr.totalPage+'": '+totalPage+', "'+pageParmStr.displayPerPage+'": '+perShow+', "'+pageParmStr.currentPage+'": '+curPage+' }' );
								}


								ajaxLoadInit( $this, defaultPostData, $button, curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, render, noneInfo );


							
						}
						
					});	
					
				} else {
					/* 
					 ---------------------------
					 Ajax with JSON data
					 ---------------------------
					 */
					
					let triggerStr = '';
					
					if ( trigger.indexOf( '[' ) >= 0 &&  trigger.indexOf( ']' ) >= 0 ) {
						triggerStr = JSON.parse( trigger.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"') );
					} else {
						triggerStr = trigger;

					}

					//Whether there are two flip buttons "Previous" and "Next"
					if ( Object.prototype.toString.call( triggerStr ) =='[object Array]' ) {

						const prevTrigger = triggerStr[0].prev,
							  nextTrigger = triggerStr[1].next;
						
						//Add default page number to the button
						$( nextTrigger ).parent().attr( 'data-cur-page', 1 );


						
						//--------------- Next Button ------------------
						//Hide the next button 
						if ( totalPage == 1 ) {
							$( nextTrigger ).addClass( 'is-hide' );	
						}

						//Avoid using $( document ) to cause an asynchronous load without counting from 1
						$( nextTrigger ).off( 'click' ).on( 'click', function( e ) {

							e.preventDefault();

							const $button = $( this );
                            let curPage = $button.parent().attr( 'data-cur-page' );
							
							//Add next page number to the button
							curPage = parseFloat( curPage ) + 1;
							$button.parent().attr( 'data-cur-page', curPage );
							
							//Init button status
							$( prevTrigger ).removeClass( triggerActive );
							$( nextTrigger ).removeClass( triggerActive );
							$( prevTrigger ).removeClass( 'is-hide' );
							


							// Active this button
							$button.addClass( triggerActive );		


							//Perform dynamic loading
							if ( customPostData != '' ) {
								defaultPostData = JSON.parse( '{ "'+pageParmStr.totalPage+'": '+totalPage+', "'+pageParmStr.displayPerPage+'": '+perShow+', "'+pageParmStr.currentPage+'": '+curPage+', '+customPostData+' }' );
							} else {
								defaultPostData = JSON.parse( '{ "'+pageParmStr.totalPage+'": '+totalPage+', "'+pageParmStr.displayPerPage+'": '+perShow+', "'+pageParmStr.currentPage+'": '+curPage+' }' );
							}

							ajaxLoadInit( $this, defaultPostData, $button, curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, render, noneInfo );
							
							return false;


						});		
						
							
						
						//----------------- Previous Button ----------------
						//Hide the prev button 
						$( prevTrigger ).addClass( 'is-hide' );
						
						//Avoid using $( document ) to cause an asynchronous load without counting from 1
						$( prevTrigger ).off( 'click' ).on( 'click', function( e ) {

							e.preventDefault();

							const $button = $( this );
                            let curPage = $button.parent().attr( 'data-cur-page' );
				
							//Add next page number to the button
							curPage = parseFloat( curPage ) - 1;
							$button.parent().attr( 'data-cur-page', curPage );
							
							//Init button status
							$( prevTrigger ).removeClass( triggerActive );
							$( nextTrigger ).removeClass( triggerActive );
							$( nextTrigger ).removeClass( 'is-hide' );
							


							// Active this button
							$button.addClass( triggerActive );		


							//Perform dynamic loading
							if ( customPostData != '' ) {
								defaultPostData = JSON.parse( '{ "'+pageParmStr.totalPage+'": '+totalPage+', "'+pageParmStr.displayPerPage+'": '+perShow+', "'+pageParmStr.currentPage+'": '+curPage+', '+customPostData+' }' );
							} else {
								defaultPostData = JSON.parse( '{ "'+pageParmStr.totalPage+'": '+totalPage+', "'+pageParmStr.displayPerPage+'": '+perShow+', "'+pageParmStr.currentPage+'": '+curPage+' }' );
							}

							ajaxLoadInit( $this, defaultPostData, $button, curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, render, noneInfo );

							
							return false;


						});						


					} else {
						
						
						//----------------- More Button ----------------
						//Add default page number to the button
						$( trigger ).attr( 'data-cur-page', 1 );

						//Hide the next button 
						if ( totalPage == 1 ) {
							$( trigger ).addClass( 'is-hide' );	

						}

						//Avoid using $( document ) to cause an asynchronous load without counting from 1
						$( trigger ).on( 'click.POST_LIST_AJAX', function( e ) {
							

							e.preventDefault();

							
							const $button = $( this );
                            
                            let curPage = $button.attr( 'data-cur-page' );

							//Add next page number to the button
							curPage = parseFloat( curPage ) + 1;
							$button.attr( 'data-cur-page', curPage );
							
						
							
							// Active this button
							$button.addClass( triggerActive );		


							//Perform dynamic loading
							if ( customPostData != '' ) {
								defaultPostData = JSON.parse( '{ "'+pageParmStr.totalPage+'": '+totalPage+', "'+pageParmStr.displayPerPage+'": '+perShow+', "'+pageParmStr.currentPage+'": '+curPage+', '+customPostData+' }' );
							} else {
								defaultPostData = JSON.parse( '{ "'+pageParmStr.totalPage+'": '+totalPage+', "'+pageParmStr.displayPerPage+'": '+perShow+', "'+pageParmStr.currentPage+'": '+curPage+' }' );
							}

							ajaxLoadInit( $this, defaultPostData, $button, curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, render, noneInfo );

							
							return false;


						});	
						
					}	
					
				
					
				}//end if
				
			}
			
		});
			
			
		/*
		 * Ajax with JSON data
		 *
		 * @param  {Element} ajaxWrapper     - The outermost container of list.
		 * @param  {Object} defaultPostData - Data to be sent to the server which is custom JSON fields.
		 * @param  {String} trigger         - Trigger ajax loaded button object.
		 * @param  {Number} curPage         - The current page to load.
		 * @param  {Number} perShow         - The amount to load each time.
		 * @param  {Number} totalPage       - The total page to load.
		 * @param  {String} template7ID     - HTML template ID
		 * @param  {String} jsonFile        - JSON file path to docking data
		 * @param  {String} triggerActive   - The class name of trigger button actived.
		 * @param  {String} pushContainer   - This container is used to display the loaded dynamic data.
		 * @param  {String} method          - The type of request to make, which can be either "POST" or "GET".
		 * @param  {String} render          - Rendering mode of display information. ==> before | html | append
		 * @param  {String} noneInfo        - Returns information of ajax asynchronous callback when the content is empty.
		 * @return {Void}
		 */
		
		function ajaxLoadInit( ajaxWrapper, defaultPostData, trigger, curPage, totalPage, perShow, template7ID, jsonFile, triggerActive, pushContainer, method, render, noneInfo ) {

			const $divRoot         = ajaxWrapper,
				  template         = document.getElementById( template7ID ).innerHTML,
				  compiledTemplate = Template7.compile( template ),
				  $button          = $( trigger );

			
			
			
			//hide the button and callback the information
			const returnEmptyInfo = function() {
				$button.addClass( 'is-hide' );
				$divRoot.after( noneInfo.none );		
			};
			
			const returnDataError = function() {
				$button.addClass( 'is-hide' );
				$divRoot.after( noneInfo.error );	
			};
			
							
			
			$.ajax({
				url      : jsonFile, //Be careful about the format of the JSON file
				method   : method,
				data     : defaultPostData,
				dataType : 'json'
            })
            .done( function (data) { 
                //If the data is empty
                if ( data && ( data == null || Object.prototype.toString.call( data.items )=='[object String]' ) ) {
                    returnEmptyInfo();
                }


                //Check if a key exists inside a json object
                if ( data && data.hasOwnProperty( 'items' ) && Object.prototype.toString.call( data.items )=='[object Array]' ) {


                    //Data overflow may occur when the total number of pages is not posted
                    try {

                        const thisData      = data,
                              html          = compiledTemplate( thisData ),
                              curHtml       = $divRoot.find( pushContainer ).html();
                        
                        let result        = null,
                            htmlEl        = null;




                        //--------- Do or not append to the original content
                        if ( render == 'before' ) {
                            result = curHtml + html;
                            htmlEl = $( result );
                            $divRoot.find( pushContainer ).before( htmlEl );	
                        }

                        if ( render == 'html' ) {
                            result = html;
                            htmlEl = $( result );
                            $divRoot.find( pushContainer ).html( htmlEl );
                        }		

                        if ( render == 'append' ) {
                            $divRoot.find( pushContainer ).append( html );

                        }	



                        //--------- Apply some asynchronism scripts
                        $( document ).UixApplyAsyncScripts({
                            ajaxPostList : false
                        });


                        //--------- Remove this button
                        $button.removeClass( triggerActive );	

                        //--------- Hidden button when the page total number is set and does not equal -1 or 9999
                        if ( 
                            curPage == totalPage && 
                            totalPage != 9999 && 
                            totalPage != -1 &&
                            totalPage != 1
                        ) {
                            returnEmptyInfo();

                        }		

                        if ( curPage == 1 ) {
                            returnEmptyInfo();

                        }			


                    } catch ( err ) {
                        console.log( err.message );
                        returnDataError();

                    }



                } else {
                    //if not array
                    returnEmptyInfo();
                }
            })
            .fail( function (jqXHR, textStatus, errorThrown) { 
                returnEmptyInfo();
            });

		}

	
	   	
		
    };

    module.components.documentReady.push( module.POST_LIST_AJAX.documentReady );
	

	return class POST_LIST_AJAX {
		constructor() {
			this.module = module;
		}
		
	};
	
})( UixModuleInstance, jQuery, window, document );


	

