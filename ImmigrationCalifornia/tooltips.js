		//tooltips
		browser.append("circle")
			.attr('fill', 'black')
			.attr("transform", "translate(" + x(new Date('1930')) + "," + 0 + ")")
			.attr("r", 5)
			.append("svg:title")
			.text('1930: The Great Depression causes downturn in immigration');
			
		browser.append("circle")
			.attr('fill', color('China, Philipenes, Vietnam'))
			.attr("transform", "translate(" + x(new Date('1859')) + "," + 0 + ")")
			.attr("r", 5)
			.append("svg:title")
			.text('1859: California passes law that bans all immigration from China');

		browser.append("circle")
			.attr('fill', color('Europe'))
			.attr("transform", "translate(" + x(new Date('1855')) + "," + 0 + ")")
			.attr("r", 5)
			.append("svg:title")
			.text('1840-1860: Irish potato famine, many flee Ireland');
			
		browser.append("circle")
			.attr('fill', 'black')
			.attr("transform", "translate(" + x(new Date('1965')) + "," + 0 + ")")
			.attr("r", 5)
			.append("svg:title")
			.text('1965: Immigration Nationality Act allows visas based on skill and family');

		browser.append("circle")
			.attr('fill', color('Latin America'))
			.attr("transform", "translate(" + x(new Date('1970')) + "," + 0 + ")")
			.attr("r", 5)
			.append("svg:title")
			.text('1970-1973: US sponsored coup in Chile');

		browser.append("circle")
			.attr('fill', color('Latin America'))
			.attr("transform", "translate(" + x(new Date('1976')) + "," + 0 + ")")
			.attr("r", 5)
			.append("svg:title")
			.text('1976: US sponsored coup in Argentina');

		browser.append("circle")
			.attr('fill', color('Mexico'))
			.attr("transform", "translate(" + x(new Date('1977')) + "," + 0 + ")")
			.attr("r", 5)
			.append("svg:title")
			.text('1976: First Mexican peso crisis');

		browser.append("circle")
			.attr('fill', color('Latin America'))
			.attr("transform", "translate(" + x(new Date('1981')) + "," + 0 + ")")
			.attr("r", 5)
			.append("svg:title")
			.text('1981-1990: US sponsored coup in Nicaragua (Iran-Contra)');

		browser.append("circle")
			.attr('fill', color('Mexico'))
			.attr("transform", "translate(" + x(new Date('1994')) + "," + 0 + ")")
			.attr("r", 5)
			.append("svg:title")
			.text('1994: NAFTA passes, Mexican goods production declines');
