import React, {useState, useEffect} from "react"
import Layout from "../components/layout"
import { fetchAPI } from "../lib/api"
import Hero from "./hero"

const Festival = ({ global, page, params, programmes, artists, news }) => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Your old jQuery code goes here

		async function getNews() {
			console.log("news")
		
			const response = await fetch("https://cms.sonicacts.com/api/news-items?filters[biennials][slug][$eq]=biennial-2024&sort[0]=date%3Adesc&populate[content][populate]=*&populate[cover_image][populate]=*");
	
			const news = await response.json();
	
			$.each(news.data, function( index, value ) {
	
				//console.log(value.attributes);
		
				var $news = $("<div class='news-item'></div>");
				var $newsImage = $("<div class='news-image'></div>");
				var $newsContent = $("<div class='news-content'></div>");
	
				var $newsHeadlineWrapper = $("<div class='news-headline-wrapper'></div>");
				var $newsHeadline = $("<h2 class='news-headline'>"+marked.parse(value.attributes.title)+"</h2>");
				var $newsDate = $("<div class='news-date'>"+value.attributes.date+"</div>");
	
				$newsHeadlineWrapper.append($newsHeadline);
				$newsHeadlineWrapper.append($newsDate);
				$newsContent.append($newsHeadlineWrapper);
		
				if (value.attributes.cover_image) {
					console.log(value.attributes.cover_image);
	
					if (value.attributes.cover_image.data && value.attributes.cover_image.data.attributes && value.attributes.cover_image.data.attributes.formats && value.attributes.cover_image.data.attributes.formats.large && value.attributes.cover_image.data.attributes.formats.large.url) {
						$newsImage.html("<img src='https://cms.sonicacts.com"+value.attributes.cover_image.data.attributes.formats.large.url+"'>");
					}
	
					$news.append($newsImage);
				}
	
				$.each(value.attributes.content, function( index, value ) {
	
					if (value.__component == "basic.text") {
						$newsContent.append(marked.parse(value.text_block));
						return false;
					}
	
				})
	
				$news.append($newsContent);
	
				var $moreContent = $("<div class='more-content' style='max-height:0; overflow:hidden;'></div>");
	
				var ignoreFirst = true;
	
				$.each(value.attributes.content, function( index, value ) {
	
					//console.log(value);
	
					if (value.__component == "basic.text") {
	
						if (ignoreFirst) {
							ignoreFirst = false;
						} else {
							$moreContent.append(marked.parse(value.text_block));
						}
					}
	
					if (value.__component == "basic.image") {
						//console.log(value.image.data.attributes.url);
	
						if (value && value.image && value.image.data && value.image.data.attributes && value.image.data.attributes.formats && value.image.data.attributes.formats.large && value.image.data.attributes.formats.large.url) {
	
							$moreContent.append("<img src='https://cms.sonicacts.com"+value.image.data.attributes.formats.large.url+"'>");
						}
					}
	
					if (value.__component == "basic.embed") {
						$moreContent.append(value.url);
					}
	
				})
	
				$newsContent.append($moreContent);
	
				var $readMoreButton = $('<div class="read-more read-more-news"><div class="read-more-inner">read more</div></div>');
	
				$readMoreButton.click(function(){
					//console.log("click");
	
					$(this).closest(".news-item").addClass("open");
	
					$(this).fadeOut();
	
					$moreContent.animate({
						"max-height": $(window).height(),
					}, 1000, function() {
	
						//console.log("done animating");
	
						$moreContent.css({
							"max-height": "unset"
						})
					});
				});
	
				$news.append($readMoreButton);
	
				$("#news-container").append($news);
				console.log("append");
	
			});
		}
	
		getNews();
	

		setTimeout(function(){
			$( document ).ready(function() {

				$(".locations-item").each(function(){
					//$(this).blast({
					//	delimiter: "character" // Set the delimiter type (see left)
					//});
				})

				async function getNews() {
					console.log("news")

					const response = await fetch("https://cms.sonicacts.com/api/news-items?filters[biennials][slug][$eq]=biennial-2024&sort[0]=date%3Adesc&populate[content][populate]=*&populate[cover_image][populate]=*");

					const news = await response.json();
					//console.log(news.data);

					$.each(news.data, function( index, value ) {

						//console.log(value.attributes);

						//cms.sonicacts.com/uploads/Anthea_Caddy_Live_02_HKW_9abd4498e9.jpeg?w=1000&q=75

						var $news = $("<div className='news-item'></div>");
						var $newsImage = $("<div className='news-image'></div>");
						var $newsContent = $("<div className='news-content'></div>");

						var $newsHeadlineWrapper = $("<div className='news-headline-wrapper'></div>");
						var $newsHeadline = $("<h2 className='news-headline'>"+marked.parse(value.attributes.title)+"</h2>");
						var $newsDate = $("<div className='news-date'>"+value.attributes.date+"</div>");

						$newsHeadlineWrapper.append($newsHeadline);
						$newsHeadlineWrapper.append($newsDate);
						$newsContent.append($newsHeadlineWrapper);

						//console.log(value.attributes);

						if (value.attributes.cover_image) {
							//console.log(value.attributes.cover_image);

							if (value.attributes.cover_image.data && value.attributes.cover_image.data.attributes && value.attributes.cover_image.data.attributes.formats && value.attributes.cover_image.data.attributes.formats.large && value.attributes.cover_image.data.attributes.formats.large.url) {
								$newsImage.html("<img src='https://cms.sonicacts.com"+value.attributes.cover_image.data.attributes.formats.large.url+"'>");
							}

							$news.append($newsImage);
						}

						$.each(value.attributes.content, function( index, value ) {

							if (value.__component == "basic.text") {
								$newsContent.append(marked.parse(value.text_block));
								return false;
							}

						})

						$news.append($newsContent);


						var $moreContent = $("<div className='more-content' style='max-height:0; overflow:hidden;'></div>");


						var ignoreFirst = true;

						$.each(value.attributes.content, function( index, value ) {

							//console.log(value);

							if (value.__component == "basic.text") {

								if (ignoreFirst) {
									ignoreFirst = false;
								} else {
									$moreContent.append(marked.parse(value.text_block));
								}
							}

							if (value.__component == "basic.image") {
								//console.log(value.image.data.attributes.url);

								if (value && value.image && value.image.data && value.image.data.attributes && value.image.data.attributes.formats && value.image.data.attributes.formats.large && value.image.data.attributes.formats.large.url) {

									$moreContent.append("<img src='https://cms.sonicacts.com"+value.image.data.attributes.formats.large.url+"'>");
								}
							}

							if (value.__component == "basic.embed") {
								$moreContent.append(value.url);
							}

						})


						$newsContent.append($moreContent);


						var $readMoreButton = $('<div className="read-more read-more-news"><div className="read-more-inner">read more</div></div>');

						$readMoreButton.click(function(){
							//console.log("click");

							$(this).closest(".news-item").addClass("open");

							$(this).fadeOut();

							$moreContent.animate({
								"max-height": $(window).height(),
							}, 1000, function() {

								//console.log("done animating");

								$moreContent.css({
									"max-height": "unset"
								})
							});
						});

						$news.append($readMoreButton);


						$("#news").append($news)


					});
				}

				getNews();




				setTimeout(function(){

					$("#center-type").addClass("visible");

					setTimeout(function(){

						$("#background-1").addClass("visible");

						setTimeout(function(){

							$("#title-1-sonic, #title-1-sonic-mobile").addClass("visible");


							setTimeout(function(){

								$("#background-2").addClass("visible");

								setTimeout(function(){

									$("#normal-01").addClass("visible");

									setTimeout(function(){

										setTimeout(function(){
											$("#title-2-acts, #title-2-acts-mobile, #fake-table, #sa-logo").addClass("visible");

											setTimeout(function(){
												$("#b-2024, #social-homelink").addClass("visible");

												$("#date").addClass("visible");

												setTimeout(function(){
													$("#sub-title").addClass("visible");

													setTimeout(function(){
														$("#table-top").addClass("visible");

														$("#locations").css({
															"display":"block",
															"opacity":1
														})

														$(".locations-item span").each(function(i){

															var span = $(this);
															span.css({
																"opacity":0
															});

															setTimeout(function(){
																span.css({
																	"opacity":1
																});
															}, 100*i)

														})


														var counter = 0;

														setTimeout(function(){

															$("#normal-02").addClass("visible");

															setInterval(function(){
																counter++;

																if (counter%2 == 0) {
																	$("#normal-01 .normal-image").fadeOut("slow");
																	$("#normal-02 .normal-image").fadeIn("slow");
																}
																if (counter%2 == 1) {
																	$("#normal-02 .normal-image").fadeOut("slow");
																	$("#normal-01 .normal-image").fadeIn("slow");
																}

															}, 5000);

														}, 10000);


													}, 300);

												}, 300);

											}, 300);

										}, 300);

									}, 300);

								}, 300);

							}, 300);

						}, 300);

					}, 400);

				}, 300);


				$("#curatorial-statement").each(function(){

					var wrapper = $(this);

					wrapper.find(".read-more-inner").click(function(){

						var readMoreButton = $(this);

						wrapper.find(".closed").addClass("opening");

						setTimeout(function(){

							wrapper.find(".closed").removeClass("opening").addClass("open");

							readMoreButton.fadeOut();

						}, 2000);

						$(".background-layer-1").fadeIn();

					});

				});


				$(".news-item").each(function(){

					var wrapper = $(this);

					wrapper.find(".read-more-inner").click(function(){

						var readMoreButton = $(this);

						wrapper.find(".closed").addClass("opening");

						readMoreButton.css({
							'opacity':0,
							'pointer-events': 'none'
						});

						setTimeout(function(){

							wrapper.find(".closed").removeClass("opening").addClass("open");

						}, 2000);

					});



					wrapper.find("h2.news-headline").click(function(){

						var readMoreButton = wrapper.find('.read-more-inner');

						wrapper.find(".closed").addClass("opening");

						readMoreButton.css({
							'opacity':0,
							'pointer-events': 'none'
						});

						setTimeout(function(){

							wrapper.find(".closed").removeClass("opening").addClass("open");

						}, 2000);

					});

				});



				$(window).scroll(function() {

					//console.log($(window).scrollTop());

					var scrollTop = $(window).scrollTop();

					$("#title-1-sonic, #title-1-sonic-mobile").css({
						"transform":"translate(-50%, calc(-50% - " + scrollTop * 0.4 + "px))"
					})

					$("#title-2-acts, #title-2-acts-mobile").css({
						"transform":"translate(-50%, calc(-50% - " + scrollTop * 0.8 + "px))"
					})


					$("#svg-biennial").css({
						"transform":"translateY(" + scrollTop * 0.4 + "px)"
					})

					$("#svg-2024").css({
						"transform":"translateY(" + scrollTop * 0.8 + "px)"
					})


					$("#svg-bottom-table").css({
						"transform":"translateY(" + scrollTop * 0.5 + "px)"
					})

					$("#background-1, #normal-01").css({
						"opacity": 1 - scrollTop/120
					})

					//$("#background-bottom").css({
					//	"transform":"translateY(" + (-1 * Math.min(scrollTop, $(window).width()*0.4) + $(window).height()) + "px)"
					//})


					var maxScroll = $(window).width() * 0.1;
					var maxScale = $(window).width() * 0.17; //how small it gets, the smaller the number the smaller


					if (
						scrollTop > ($("#intro-wrapper").outerHeight() + $("#curatorial-statement").outerHeight() - $(window).height())
						|| scrollTop < $(window).height()/2
					) {
						$(".background-layer-1").fadeOut();
					} else {

						$(".background-layer-1").fadeIn();
					}
				})


				var closer = $("<div className='closer'>x</div>");

				closer.click(function(){
					$(this).closest(".closer-target").hide();
				});


				$("#imprint-content").addClass("closer-target").append(closer.clone(true));

				$("#imprint-link").click(function(){
					$("#imprint-content").show();
				});

			});

		},100)

	  }, []); // Empty dependency array means this effect will run once after the initial render
	

  return (
		<>
			<section className="festival-home">
				<Layout  global={global} festival={page}>

					<div id="intro-wrapper">

						<h1 className="visually-hidden">Sonic Acts 2024</h1>
						<h2 className="visually-hidden">The Spell of the Sensuous</h2>

						<div id="background-1" className="hide-at-pageload">
							<img src="assets/img/background-1.jpg" alt="background" width="" height="" />
						</div>					

						<div id="title-1-sonic" class="hide-at-pageload visible">
							<svg x="0px" y="0px" viewBox="0 0 3840 2500" preserveAspectRatio="none">

								<g id="sonic">
									<path id="sonic-c" class="st3" d="M2887.7,704.3c0-339.6,203.7-548.3,461.4-548.3c219.3,0,380.2,133.8,440,360.6l-4.5,1.2
										C3725.5,291,3566.1,156,3349.1,156c-255.2,0-456.7,208.7-456.7,548.3c0,331.9,162.8,548.3,456.7,548.3
										c197.1,0,365-133.4,427-322.2l4.5,1.2c-62.7,188.8-227.1,321-431.5,321C3058.2,1252.6,2887.7,1036.2,2887.7,704.3z"></path>

										<line id="sonic-i_00000010287208272025419640000000722510811919507843_" class="st4" x1="2547.6" y1="908.7" x2="2547.6" y2="67.9"></line>
									<polyline id="sonic-n_00000060729758451550627050000004753849222039688595_" class="st4" points="1963,909.9 1963,68.9
										2006.2,68.9 2353.6,909.9 2397.6,909.9 2397.6,68.9 		"></polyline>
									<g id="sonic-o_00000046326931432250944080000005180126274599846815_">
										<path class="st3" d="M1038.8,543.3c0,287.7,151.4,475.2,383.2,475.2c-229.5,0-379.4-187.5-379.4-475.2
											c0-294.5,167.4-475.4,379.4-475.4C1208,67.9,1038.8,248.9,1038.8,543.3z"></path>
										<path class="st3" d="M1422.1,67.9c212,0,379.5,181,379.5,475.3c0,287.8-150,475.3-379.5,475.3c231.9,0,383.2-187.5,383.2-475.3
											C1805.3,248.9,1636.1,67.9,1422.1,67.9z"></path>
									</g>
									<g id="sonic-s_00000177482154062748682530000007728117883412345746_">
										<path class="st3" d="M77.8,906.9l-4.5,1.4c53.8,291,197.8,438.5,447.2,453.1C273.6,1346.7,131,1197.8,77.8,906.9z"></path>
										<path class="st3" d="M624.6,684.6l-100.9-16.2l99.9,16.2c160.2,26.2,345.1,79.9,345.1,313.4c0,188.6-152.4,364.4-405.9,364.6
											c-14.5,0-28.5-0.4-42.3-1.3c13.7,0.8,27.7,1.3,42,1.3h0.4c256.2,0,410.2-175.9,410.2-364.6C973.1,764.5,786.4,710.8,624.6,684.6z
											"></path>
										<g>
											<g>
												<path class="st3" d="M148.5,374.8C148.5,170,328.3,69.5,516,69.5c-189.7,0-371.3,100.5-371.3,305.3
													c0,197.6,214,269.8,345.4,288.2l33.6,5.4l-33.3-5.4C360.4,644.6,148.5,572.4,148.5,374.8z"></path>
												<path class="st3" d="M516,69.5c3.7,0,7.4,0,11.2,0.1C523.6,69.5,519.7,69.5,516,69.5z"></path>
											</g>
											<path class="st3" d="M814.3,168.4c-66.2-61.1-158.4-96.8-287.1-98.7c127.4,2,218.7,37.6,284.3,98.7
												c72.3,68.3,101.2,134.7,122,210.1l4.2-1.4C916.4,301.7,887.2,236.7,814.3,168.4z"></path>
										</g>
									</g>
								</g>

							</svg>        
						</div>

						<div id="title-1-sonic-mobile" className="hide-at-pageload">
						<svg version="1.2" baseProfile="tiny" id="Ebene_1"
						x="0px" y="0px" viewBox="0 0 2000 2098.3" overflow="visible">

						<g id="sonic">
						<g id="sonic-o">
						<path fill="none" d="M750.5,456.2
							c0,239.6,143.3,395.7,362.8,395.7c-217.2,0-359.2-156.1-359.2-395.7c0-245.2,158.4-395.9,359.2-395.9
							C910.6,60.3,750.5,211,750.5,456.2z"/>
						<path fill="none" d="M1113.5,60.3
							c200.7,0,359.2,150.7,359.2,395.8c0,239.7-142,395.8-359.2,395.8c219.6,0,362.8-156.1,362.8-395.8
							C1476.3,211,1316.1,60.3,1113.5,60.3z"/>
						</g>
						<g id="sonic-i">
							<line fill="none" x1="1836.8" y1="437.8" x2="1836.8" y2="60.2"/>
						</g>
						<g id="sonic-n">
						<polyline fill="none" points="1532.2,437.8
							1532.2,60.2 1556.8,60.2 1754.6,437.8 1779.7,437.8 1779.7,60.2 		"/>
						</g>
						<g id="sonic-s">
						<path fill="#FFBBF1" d="M71.5,572l-3.2,0.9c39,178.5,143.4,269.1,324.2,278C213.4,841.9,110.1,750.6,71.5,572"/>
						<path fill="none" d="M71.5,572l-3.2,0.9
							c39,178.5,143.4,269.1,324.2,278C213.4,841.9,110.1,750.6,71.5,572z"/>
						<path fill="#FFBBF1" d="M467.9,436.3l-73.1-9.9l72.4,9.9c116,16.1,250,48.9,250,192c0,115.6-110.4,223.3-294.1,223.4
							c-10.5,0-20.6-0.3-30.6-0.8c9.9,0.5,20,0.8,30.4,0.8h0.3c185.6,0,297.3-107.8,297.3-223.4C720.4,485.2,585.2,452.3,467.9,436.3"/>
						<path fill="none" d="M467.9,437.3
							l-73.1-9.9l72.4,9.9c116,16.1,250,48.9,250,192c0,115.6-110.4,223.3-294.1,223.4c-10.5,0-20.6-0.3-30.6-0.8
							c9.9,0.5,20,0.8,30.4,0.8h0.3c185.6,0,297.3-107.8,297.3-223.4C720.4,486.2,585.2,453.3,467.9,437.3z"/>
						<path fill="#FFBBF1" d="M122.9,247.8c0-125.6,130.3-187.2,266.3-187.2c-137.5,0-269.1,61.6-269.1,187.2
							c0,121.1,155.1,165.4,250.3,176.7l24.3,3.3l-24.1-3.3C276.4,413.2,122.9,368.9,122.9,247.8"/>
						<path fill="none" d="M122.9,247.8
							c0-125.6,130.3-187.2,266.3-187.2c-137.5,0-269.1,61.6-269.1,187.2c0,121.1,155.1,165.4,250.3,176.7l24.3,3.3l-24.1-3.3
							C276.4,413.2,122.9,368.9,122.9,247.8z"/>
						<path fill="#FFBBF1" d="M389.2,60.6c2.7,0,5.3,0,8.1,0.1C394.7,60.6,391.9,60.6,389.2,60.6"/>
						<path fill="none" d="M389.2,60.6
							c2.7,0,5.3,0,8.1,0.1C394.7,60.6,391.9,60.6,389.2,60.6z"/>
						<path fill="#FFBBF1" d="M605.6,121.4c-48-37.6-114.9-59.5-208.3-60.7c92.5,1.2,158.7,23.1,206.2,60.7
							c52.4,42,73.4,82.8,88.5,129.2l3-0.9C679.7,203.4,658.5,163.4,605.6,121.4"/>
						<path fill="none" d="M605.6,121.4
							c-48-37.6-114.9-59.5-208.3-60.7c92.5,1.2,158.7,23.1,206.2,60.7c52.4,42,73.4,82.8,88.5,129.2l3-0.9
							C679.7,203.4,658.5,163.4,605.6,121.4z"/>
						</g>
						<g id="sonic-c">
						<path fill="none" d="M1418.4,873.7
							c0-180.1,119.9-290.7,271.7-290.7c129.1,0,223.8,70.3,259,190.6l-2.6,1.3C1911.7,654.6,1817.9,583,1690.1,583
							c-150.2,0-268.9,110.6-268.9,290.7c0,176,95.9,290.7,268.9,290.7c116,0,214.9-70.7,251.5-170.8l2.6,1.3
							c-37,100.1-133.7,169.6-254.1,169.6C1518.9,1164.4,1418.4,1049.7,1418.4,873.7z"/>
						</g>
						</g>

						</svg>        </div>

						<div id="title-2-acts" className="hide-at-pageload">
						<svg x="0px" y="0px" viewBox="0 0 3840 2500" preserveAspectRatio="none">

						<g id="acts">
						<path id="acts-s" className="st1" d="M2921,1900c19.7,105.8,57.6,183.6,113.6,235.2c56.2,51.7,130,76.9,225.6,76.9
							c83.4,0,155.5-26.5,208.3-76.7c24.4-23.2,43.5-50.5,56.6-80.9c13.1-30.3,19.7-62.4,19.7-95.3c0-161.1-181.3-188.9-236.4-200.9
							c-55.1-12-99.8-18.1-99.8-18.1c-85.1-15.6-118.1-13.3-164.2-47.3c-50.3-37.1-74.7-86-74.7-149.3c0-66.8,28-122.5,81-161.1
							c46.3-33.6,109.3-52.1,177.6-52.1c88.8,0,156.3,22.3,206.4,68c53.4,49.5,72.7,98.7,85.7,144.6l2.8-1.4
							c-13.1-45.9-32.6-93.7-86.5-143.2c-50.6-45.8-118.8-68-208.4-68c-68.9,0-132.7,18.5-179.4,52.1c-53.5,38.6-81.8,94.3-81.8,161.1
							c0,63.3,24.7,112.3,75.4,149.3c46.5,34,79.8,31.7,165.9,47.3c0,0,45.1,6.1,100.8,18.1c55.7,12,238.7,39.8,238.7,200.9
							c0,32.9-6.7,65-20,95.3c-13.3,30.4-32.6,57.7-57.3,80.9c-53.4,50.2-126.2,76.7-210.5,76.7c-96.6,0-171.1-25.2-227.8-76.9
							c-56.5-51.6-93.7-128-113.6-233.8L2921,1900z"/>
						<g id="acts-t">
							<line className="st1" x1="3097.2" y1="1243" x2="2425.2" y2="1243"/>
							<line className="st1" x1="2761.2" y1="1243" x2="2761.2" y2="2034.8"/>
						</g>
						<path id="acts-c" className="st2" d="M2356.5,1868.1c-69.5,227.6-230.3,343.3-423.3,341.1c-284.5,0-464.5-291.2-456-621.2
							c-2.5-327.4,214.4-575.7,460.1-575.7c186.7,0,372.7,129.8,427.8,386.2l-7.4,2.8c-54.1-256.4-237.7-389.1-420.7-389.1
							c-240.8,0-454.9,248.3-452.4,575.7c-8.4,330,169.5,621.2,448.2,621.2c189.1,2.2,348.1-118.3,416.2-345.9L2356.5,1868.1z"/>
						<g id="acts-a">
							<path className="st1" d="M1583.7,2452.4l-435.3-1280.1h-40.2L666.7,2452.4"/>
							<line className="st1" x1="828.6" y1="1996.5" x2="1425" y2="1996.5"/>
						</g>
						</g>

						</svg>
						</div>

						<div id="title-2-acts-mobile" className="hide-at-pageload">
						<svg version="1.2" baseProfile="tiny" id="Ebene_1" x="0px" y="0px" viewBox="0 0 2000 2098.3" overflow="visible">

						<g id="acts">
						<g id="acts-a">
						<path fill="none" d="M171.3,1757.4h442.5
							M731.4,2042.3l-322.9-877.8h-29.8L51.2,2042.3"/>
						</g>
						<g id="acts-c">
						<path fill="none" d="M1324.9,1556.6
							c-58.7,163.2-194.5,247.6-357.4,246c-240.2,0-392.2-208.8-385-445.5c-2.2-234.8,180.9-412.9,388.4-412.9
							c157.7,0,314.7,93.1,361.3,277l-6.3,2c-45.7-183.9-200.7-279-355.3-279c-203.3,0-384.1,178-382,412.9
							c-7.1,236.7,143.2,445.5,378.5,445.5c159.7,1.6,294-86.2,351.5-249.4L1324.9,1556.6z"/>
						</g>
						<g id="acts-t">
						<path fill="none" d="M1464.2,1307.7V1753
							M1650.2,1307.7h-372"/>
						</g>
						<g id="acts-s">
						<path fill="#FF820A" d="M1520.5,1686.8l-2.1,0.5c25.5,113.6,93.9,171.2,212.2,176.9C1613.4,1858.6,1545.8,1800.5,1520.5,1686.8"/>
						<path fill="none" d="M1520.5,1686.8l-2.1,0.5
							c25.5,113.6,93.9,171.2,212.2,176.9C1613.4,1858.6,1545.8,1800.5,1520.5,1686.8z"/>
						<path fill="#FF820A" d="M1780,1600.4l-47.9-6.3l47.4,6.3c75.9,10.2,163.6,31.2,163.6,122.2c0,73.6-72.3,142.1-192.5,142.2
							c-6.9,0-13.5-0.2-20-0.5c6.5,0.3,13.1,0.5,19.9,0.5h0.2c121.5,0,194.5-68.6,194.5-142.2C1945.3,1631.6,1856.7,1610.7,1780,1600.4"
							/>
						<path fill="none" d="M1780,1600.4l-47.9-6.3
							l47.4,6.3c75.9,10.2,163.6,31.2,163.6,122.2c0,73.6-72.3,142.1-192.5,142.2c-6.9,0-13.5-0.2-20-0.5c6.5,0.3,13.1,0.5,19.9,0.5h0.2
							c121.5,0,194.5-68.6,194.5-142.2C1945.3,1631.6,1856.7,1610.7,1780,1600.4z"/>
						<path fill="#FF820A" d="M1554.2,1480.5c0-79.9,85.2-119.1,174.3-119.1c-90,0-176.1,39.2-176.1,119.1
							c0,77.1,101.5,105.2,163.8,112.4l15.9,2.1l-15.8-2.1C1654.7,1585.8,1554.2,1557.6,1554.2,1480.5"/>
						<path fill="none" d="M1554.2,1480.5
							c0-79.9,85.2-119.1,174.3-119.1c-90,0-176.1,39.2-176.1,119.1c0,77.1,101.5,105.2,163.8,112.4l15.9,2.1l-15.8-2.1
							C1654.7,1585.8,1554.2,1557.6,1554.2,1480.5z"/>
						<path fill="#FF820A" d="M1728.5,1361.4c1.8,0,3.5,0,5.3,0.1C1732,1361.4,1730.2,1361.4,1728.5,1361.4"/>
						<path fill="none" d="M1728.5,1361.4
							c1.8,0,3.5,0,5.3,0.1C1732,1361.4,1730.2,1361.4,1728.5,1361.4z"/>
						<path fill="#FF820A" d="M1870.1,1400.1c-31.4-23.9-75.2-37.9-136.3-38.6c60.5,0.8,103.8,14.7,135,38.6
							c34.3,26.7,48,52.7,57.9,82.2l2-0.5C1918.6,1452.2,1904.7,1426.8,1870.1,1400.1"/>
						<path fill="none" d="M1870.1,1400.1
							c-31.4-23.9-75.2-37.9-136.3-38.6c60.5,0.8,103.8,14.7,135,38.6c34.3,26.7,48,52.7,57.9,82.2l2-0.5
							C1918.6,1452.2,1904.7,1426.8,1870.1,1400.1z"/>
						</g>
						</g>


						</svg>        </div>

						<div id="b-2024" className="hide-at-pageload">
							<div id="b-2024-inner">
								<div id="svg-biennial">
						<svg id="Ebene_1" x="0px" y="0px" viewBox="0 0 5055.6 523.9">

						<g id="bottom-biennial">
						<path id="bottom-biennial-3" className="st321408h124" d="M1314.9,160.2V498 M1271.8,498c-1-13-2.1-25-2.1-46.2V333.2c0-50.1-30.3-70.3-80-70.3
							c-42.1,0-72.9,22.2-85.7,41.9 M1261.8,355.9c0,0-37.7-2.9-65.4-2.9c-52.3,0-101.1,23.1-101.1,74.7c0,48.7,25.4,74.2,81.6,74.2
							s88.4-28.9,88.4-28.9 M1064,232.1v-71.9 M1064,498V267.2 M655.1,266.7V498 M815.7,498V332.3c0-40.5-26.9-68.9-80.8-68.9
							c-15.8,0-34.7,5.5-50.7,14.1l-24.1,17.7 M421.2,381.9h198.3c0,0,0.5-10.1,0-15.4c-5.1-64.1-42.6-103.1-101.1-103.1
							c-63.1,0-106.2,47.2-106.2,119.5c0,71.8,42.6,119.9,106.2,119.9 M518.4,502.8c50.3,0,88.8-30.8,99-80 M378.4,232.1v-71.9
							M378.4,498V267.2 M73.6,306.4h188.6c29.5,0,60.8-25.7,60.8-69c0-44.6-34.8-76.6-96.4-76.6h-153V498H206
							c75.9,0,129.3-32.8,129.3-105c0-48-29.4-86.6-73.1-86.6"/>
						<line id="bottom-biennial-2" className="st321408h124" x1="857.9" y1="266.7" x2="857.9" y2="498"/>
						<path id="bottom-biennial-1" className="st321408h124" d="M1018.5,498V332.3c0-40.5-26.9-68.9-80.8-68.9c-15.8,0-34.7,5.5-50.7,14.1l-24.1,17.7"
							/>
						</g>
						</svg>

						</div>


						<div id="svg-2024">

						<svg id="Ebene_1" x="0px" y="0px" viewBox="0 0 5055.6 523.9">
						<g id="bottom-2024">
						<path id="bottom-2024-2" className="st012308912h3" d="M4970.2,495.5V168h-23.3l-159.6,239.5l11,17.8h233.4 M4421.9,502.8
							c76.4,0,131.9-59.7,131.9-168.6c0-107.9-50.8-168.6-131.9-168.6c-81.6,0-132.9,60.7-132.9,168.6
							C4289,443,4344.9,502.8,4421.9,502.8 M4018.5,266.3c10.3-58.3,60.3-100.7,123.6-100.7c88.8,0,114.4,53.9,114.4,96.8
							c0,53.5-35.9,61.4-131.3,99.2s-102.4,67.1-119.3,117.7L4020,498h236"/>
						<path id="bottom-2024-1" className="st012308912h3" d="M4586.5,266.3c10.3-58.3,60.3-100.7,123.6-100.7c88.8,0,114.4,43.9,114.4,86.8
							c0,53.5-35.9,71.4-131.3,109.2s-102.4,67.1-119.3,117.7L4588,498h236"/>
						</g>
						</svg>


						</div>

						<div id="svg-bottom-table">

						<svg id="Ebene_1" x="0px" y="0px" viewBox="0 0 5055.6 523.9">

						<g id="bottom-biennial-table">
						<line id="bottom-biennial-table-6" className="st1as9213h" x1="21.2" y1="56.5" x2="5031.7" y2="56.5"/>
						<line id="bottom-biennial-table-5" className="st21203912jh3" x1="21.2" y1="524.2" x2="21.2" y2="56.5"/>
						<line id="bottom-biennial-table-4" className="st1as9213h" x1="837.8" y1="524.2" x2="837.8" y2="56.5"/>
						<line id="bottom-biennial-table-3" className="st1as9213h" x1="4042.7" y1="524.2" x2="4042.7" y2="56.5"/>
						<line id="bottom-biennial-table-2" className="st1as9213h" x1="5031.7" y1="524.2" x2="5031.7" y2="56.5"/>
						<line id="bottom-biennial-table-1" className="st1as9213h" x1="21.2" y1="377.7" x2="4042.7" y2="377.7"/>
						</g>
						</svg>


						</div>            </div>
						</div>



						<div id="sub-title" className="hide-at-pageload">
							<div className="black-label">
								The Spell of the Sensuous
							</div>
						</div>



						<div id="date" className="hide-at-pageload">
							<div id="date-inner">
								<div className="start-date date black-label">
									02 Feb
								</div>

								<div className="end-date date black-label">
									24 Mar
								</div>


							</div>

							<div id="date-location" className="black-label">
									Amsterdam
							</div>


						</div>

						

						<div id="center-type" className="mono-s hide-at-pageload">
							<p>
								30th Anniversary Edition
							</p>
						</div>

						<div id="locations" className="hide-at-pageload">
							<div id="locations-inner">

								<div className="locations-center">
									<div className="locations-item locations-center-item">
										exhibition
									</div>
									<div className="locations-item locations-center-item">
										symposium
									</div>
								</div>

								<div className="locations-left">
									<div className="locations-item locations-left-item">
										concerts
									</div>
									<div className="locations-item locations-left-item">
										sound art
									</div>
									<div className="locations-item locations-left-item">
										spatial <br />
										sound <br />
										platform
									</div>
									<div className="locations-item locations-left-item">
										club nights
									</div>
									<div className="locations-item locations-left-item">
									live cinema
									</div>
								</div>

								<div className="locations-right">
									<div className="locations-item locations-center-item">
										field walks
									</div>

									<div className="locations-item locations-right-item">
										workshops
									</div>
									<div className="locations-item locations-right-item">
										public <br />
										programmes
									</div>

								</div>
							</div>
						</div>

						<div id="writing">
							<div id="character-01" className="character">
								<svg id="uuid-b1c833a3-0512-4877-8dc5-f092e6541fd2" viewBox="0 0 41.01 73.55"><path className="uuid-6590461a-5f48-48f2-83d8-bc23cc1e4639" d="M28.53,6.5l-.16-.04s.08,.02,.12,.04c.04,0,.09,.02,.13,.03l-.09-.02Z"/><path className="uuid-6590461a-5f48-48f2-83d8-bc23cc1e4639" d="M38.23,10.01c2.6-.69,1.75-4.87-.69-5.15-2.28,.05-4.2,.14-6.55,.99-.85,.28-1.61,.98-2.51,.64-3.43-.78-6.92-1.26-10.4-1.74-.64-6.7-6.48-2.96-9.35-.1-2.4,2.95-3.21,6.82-4.88,10.18-1.78,3.87-3.44,11.38-2.67,15.55,1.74,4.83,4.64,9.41,9.32,11.87,1.99,2.54,5.58,2.92,7.75,5.36-1.67,2.67-5.92,1.27-8.31,4.57-1.53,1.84-1.64,4.98,.34,6.54,2.2,1.17,4.9,1.06,7.3,1.67,2.31,.25,3.72-1.87,3.94-3.93,1.05-1.92,2.12-3.87,3.45-5.6,4.69,.68,9.77-6.02,11.63-9.77,.69-2.28-.3-5.12-2.75-5.8-2.31-.49-4.4,1.48-6.51,2.23-2.12,1.34-2.74,4.1-4.48,5.86-2.81-3.14-6.82-4.49-9.87-7.17-2.1-1.29-4.3-2.98-5.06-5.41,.35,0,.71-.07,1.03-.25,.53-.29,.91-.77,1.12-1.32h0c.31-.85,.67-1.85,1.66-2.06,3.75,3.36,6.69-1.38,11.09,3.56,1.73,.92,3.6,.08,4.97-1.06,4-1.36,6.97-5.26,6.83-9.54,2.49-1.58,5.28-3.86,4.38-7.22-.04-1.08-1.44-1.9-.77-2.91Zm-3.61,2.8c-2.56,.7-4.82,2.83-5.48,5.43-.34,1.28,.13,2.82-.99,3.78-1.79,1.39-3.98,2.02-5.49,3.84-6.08-.7-9.05-8.97-15.12-3.54,.64-4.01,2.89-7.57,4.27-11.37,5.52-.09,11.05,1.26,16.45,2.3,2.79,.72,4.43-1.94,6.66-2.94-.23,.81-.32,1.65-.32,2.49Z"/><path className="uuid-6590461a-5f48-48f2-83d8-bc23cc1e4639" d="M22.03,63.47c-1.85-.96-4.24-1.27-5.97,.11-1.96,1.69-4.61,4.52-2.73,7.16,1.07,1.56,3.1,1.13,4.3-.03,1.99,1.03,3.93-.24,5.92-.52,2.56-1.2,4.94-3.57,6.1-6.17,.76-6.36-5.61-5-7.62-.56Z"/></svg>
							</div>
							<div id="character-02" className="character">
								<svg id="uuid-06d0f966-aea6-459a-859a-2065e96c6a99" viewBox="0 0 56.7 67.15"><path className="uuid-b0b2b062-46f2-4156-8b3e-e107e8f15195" d="M53.87,25.92c-.99-2.8-3.71-3.46-6.09-3.33-4.94,.98-2.4-2.99-5.7-4.69-3.29-.42-10.79-.26-10.93,4.93-.73,.46-1.53,.76-2.33,1-4.01-2.02-8.13,.82-12.06,1.66,.54-2,1.44-3.86,2.44-5.59,4.24,.13,8.29-.99,12.48-1.47,7.16-.04,4.95-8,5.32-13.6-.63-8.12-8.82-1.09-12.14,.85-4.19,2.73-8.4,5.99-10.82,10.93-2.32-.01-4.64-.22-6.95-.31-.76,.11-1.18,1.18-1.07,1.97,.71,2.9,4.35,1.4,6.32,2.01-4.22,12.72,1.31,15.42,11.05,10.89,1.45-1.09,3.08-1.48,4.63-2.32,.96-.72,1.82-1.58,2.98-1.87,1.34-.38,2.88,.12,4.08-.88,1.47-.03,2.9-.65,4.37-.75,.9,3.04,3.99,3.18,5.8,1.14,2.25-.95,5.07-.85,5.84,2.21,.46,.74,1.24,1.07,2.01,1.09,.46,4.11-2.77,6.46-4.83,9.15-.44,.14-.86,.34-1.23,.68-.26,.24-.49,.5-.72,.76-1.29-5-6.07-3.03-8.69-.68-.82-5.14-6.56-4.14-8.66-.66-.61-4-4.44-3.65-6.87-2.12-3.07,1.41-6.07,2.95-8.76,5.19-2.33-2.59-6.17-3.51-9.34-3.31-5.02,1.32-2.96,7.72,.66,9.6-.12,4.95,2.97,7.49,6.09,3.29,1.15,1.49,2.92,1.99,4.44,2.82,1.07,4.09,1.18,10.79,5.75,11.66,1.47-.04,2.27-1.68,3.53-2.34,1.76-1.7,3.5-5.66,1.71-7.93-1.41-.97-2.77,.7-4.14,1.31-.7,.17-1.45,.27-1.99,.89-.83-3.4-.71-7.49-3.39-9.82,1.81-1.52,3.83-2.57,5.91-3.48-.1,3.81,3.22,7.2,5.85,3.66,1.54-1.51,.83-4.95,3.35-5.11-.76,1.26-1.56,2.48-2.39,3.67-1.86,2.56,.27,7.71,3.3,5.96,1-.57,1.41-1.9,2.24-2.71,1.79-1.69,3.89-2.84,5.84-4.23,.11,2.65-.34,6.21,1.95,7.81,2,1.26,3.86-1.04,4.62-3.01,2.03-5.39,3.42-3.81,4.36-10.14,2.75-3.03,6.24-11.7,2.21-14.8ZM22.77,15.88c3.21-2.85,6.99-4.68,10.21-7.54,.04,1.86,.38,3.68,.61,5.51-1.79,1.24-3.99,.7-6,1.19-1.66,.36-3.25,1.1-4.97,.97,.05-.05,.1-.09,.15-.14Z"/></svg>
							</div>
							<div id="character-03" className="character">
								<svg id="uuid-7eb237d7-c0f5-4f03-93fb-cb0d39abb13a" viewBox="0 0 67.85 52.28"><path className="uuid-88529e8a-2dde-4d6f-89a8-d1f4d9c51930" d="M54.51,13.74c.11-.05,.22-.1,.33-.15-.12,.05-.21,.09-.31,.14,0,0-.02,0-.03,.01,0,0,0,0,0,0Z"/><path className="uuid-88529e8a-2dde-4d6f-89a8-d1f4d9c51930" d="M64.55,15.65c.88-4.54,4.67-12.35-1.55-14.62-3.41-.46-4.29,3.75-7.05,4.9-9.68,5.13-17.88,12.49-27.63,17.49,.08-6.65-7.36-5.53-11.07-2.37-9.22-3.5-11.11,7.53-3.56,7.84,.55,1.02,1.55,1.58,2.59,1.69-2.79,1.87-5.28,4.2-6.36,7.43-.34,.17-.71,.26-1.08,.33-6.34-6.05-11.91,6.34-3.78,8.05,.34,.78,.68,1.56,1.02,2.34,.49,1.11,1.38,2.07,2.64,2.29,2.86,.46,4.65-2.91,3.8-5.32,6.5-3.45,.86-8.86,8.07-13.46,.27-.23,.43-.53,.51-.86,1.45,.76,3.52,.47,5.24,.19,4.99-.89,10.98,.86,15.21-2.42,0,0,0,0,0,0,1.51,1.94,3.23,4.05,5.81,4.52,2.32,.46,4.14-1.05,5.84-2.35,4.42-3.11,13.08-4.14,12.7-10.92-.09-1.69-1.71-3.06-1.36-4.74Zm-16.37,9.56c-1.8-2.04-3.59-4.72-6.56-5.04,4.11-2.37,8.34-4.44,12.69-6.35-.01,0-.03,.01-.04,.02-.1,.05-.2,.09-.3,.13,.2-.09,.38-.17,.56-.25,1.15-.5,2.3-1.02,3.45-1.54-.63,2.54-1.05,5.26,.02,7.75-3.29,1.71-6.88,2.95-9.82,5.27Z"/></svg>
							</div>
							<div id="character-04" className="character">
								<svg id="uuid-a510a216-a807-4440-b1e7-6404a62e96a3" viewBox="0 0 54.88 47.2"><path className="uuid-215db198-64f2-4bde-8978-a068bdb72790" d="M49.29,14.34c-3.95,.92-8.11,1.12-11.96,2.39-2.51,1.23-1.85,4.15-1.5,6.38,.16,2.41-.65,4.77-.58,7.19-2.85,2.71-9.16,9.68-13.32,8.1-3.08-2.18-6.36-3.94-9.8-5.48-2.56-2.21-5.3-4.17-7.76-6.54,.63-4.36-.22-9.12,1.76-13.15,.37-.75,.71-1.47,1.08-2.11,.34,1.13,1.11,2.15,2.27,2.6,.07,1.68-.06,3.76,1.49,4.85-.48,1.17-.23,2.69,.81,3.47,3.45,1.81,4.99-3.89,6.42-6.07,2.47,.87,4.85-.02,7.3,.01,6.17,.55,5.83-5.44,2.18-8.68,1.23-2.2-.47-5.69-3.24-4.91-1.45-1.74-4.24-2.07-5.17,.37-1.84-.68-2.65,1.34-3.08,2.76-.95-1.25-2.27-1.75-3.46-1.56-.05-.05-.1-.11-.15-.17C8.24,.45,3.64,4.91,2.07,8.99c-1.59,2.6-1.12,5.67-.43,8.45,1.07,3.46-.28,7.13,.44,10.5,2.54,2.84,5.21,5.72,7.97,8.39,2.37,1.88,5.45,2.72,7.42,5.14,5.21,6.92,10.98,2.49,16.26-1.67-.4,1.99-.4,4.9,2.11,5.4,4.41,.23,3.45-7.39,4.91-10.3,1.43-.67,1.81-2.34,2.61-3.57,1-1.22,2.36-2.13,3.61-3.09,.66-.47,1.51-.15,2.24-.43,1.89-.66,2.44-3.27,1.47-4.89,3.55-2.26,4.04-9.12-1.39-8.59Z"/></svg>
							</div>
							<div id="character-05" className="character">
								<svg id="uuid-d19d3269-b5fc-49cf-8b20-90329a826d5f" viewBox="0 0 63.56 35.89"><path className="uuid-502c1b12-c759-4bd7-9f86-ea80a5842130" d="M18.8,24.38c-2.08-.13-4,.9-6.03,1.17-3.41,.1-6.92-.72-10.2,.6-2.07,.57-3.06,3.77-.82,4.77,1.96,.2,3.98-.35,6.03,.16,.68,1.52,2.02,2.91,3.39,3.8,1.77,.66,3.23-1.29,3.09-2.92,2.46-.13,5.44-.17,7.2-2.15,1.59-2.13-.12-5.25-2.67-5.42Z"/><path className="uuid-502c1b12-c759-4bd7-9f86-ea80a5842130" d="M61.38,21.7h0c-2.1-1.04-4.21,.76-6.29,.94-.12,.02-.25,.03-.37,.05,.31-2.24-.18-5.25-.64-6.57-1.24-3.74-3.32-7.36-6.11-10.15C45.04,1.15,41.47,.48,36.15,.89c-5.18-.35-6.69,1.84-10.84,3.99-4.33,2.16-8.57,4.73-11.57,8.61-9.46,10.45-.63,12.57-1.73,8.03,3.15-5.07,7.6-9.64,13.26-11.85,4.27-2.61,9.39-4.14,14.37-2.87,2.09-.04,3.26,1.26,4.33,2.9,1.9,1.96,3.46,4.15,4.62,6.64,1.16,1.97,.91,4.35,1.46,6.47-1.73-.04-3.45-.03-5.07,.53-3.53,1.55-1.1,7.9,2.46,5.47,.37-.01,.74,0,1.11,.01-.03,1.35,.24,2.79,1.17,3.82,2.88,2.45,4.7-1.38,4.66-3.97,1.77,0,3.45-.46,5.07-1.15,.9-.14,1.9-.23,2.53-.98,1.3-1.35,1.11-3.92-.58-4.86Z"/></svg>
							</div>

						</div>
						<div id="normal-01" className="hide-at-pageload">
							<div className="normal-image">
								<img src="./assets/img/georgiaokeefe_sunrise-shell-06-LRES_Kopie-var04.jpg" />
								<video id="eyes-video" src="./assets/videos/eye-9-low.mp4" loop muted autoPlay></video>
							</div>
						</div>

						<div id="normal-02" className="hide-at-pageload">
							<div className="normal-image">
								<img src="./assets/img/brown.png" />
								<video id="eyes-video" src="./assets/videos/eye-7-low.mp4" loop muted autoPlay></video>
							</div>
						</div>

						</div>

					<div id="news-container"></div>
					
				</Layout>
			</section>
		</>
  )
}


export default Festival
