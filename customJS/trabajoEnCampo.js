function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Trabajo en Campo");

	$(document).delegate('.lnkMenuBar_Item', 'click', function(event) 
	{
		var vinculo = $(this).attr('vinculo');
		$("#contenedorDeModulo").cargarModulo(vinculo, function()
			{

			});

	});

	$(document).delegate('.btnTrabajoEnCampo_Volver', 'click', function(event) {
		event.preventDefault();

		$("#contenedorDeModulo").cargarModulo('trabajoEnCampo.html', function()
			{

			});
	});
}

