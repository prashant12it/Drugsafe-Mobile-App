    $(function () {
		/*Navigation Start*/
        $("#Header .navbar-header").click(function () {
            $("#MainNav").slideToggle();
        });

        $('#Header .sm').smartmenus();		
		/*Navigation End*/
		
		/*Responsive Cart Table*/
		$("#CartItems tr td").each(function () {
			var idx = $(this).parent().find("td").index(this) + 1;
			$(this).attr("data-title", $(this).parent().parent().find("tr th:nth-child(" + idx + ")").text());
		});
		
		/*Color Box*/
		$("a.colorbox").colorbox({ iframe: true, width: "960px", height: "409px", loop: false, maxWidth:'95%', maxHeight:'95%'});
    });	