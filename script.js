Handlebars.registerHelper('getAge', function(bdate) {
	if(!bdate) return;
	bdate = bdate.split('.');
	bdate = new Date(`${bdate[2]}-${bdate[1]}-${bdate[0]}`);
	return (Date.now() - bdate)/31536000000>>0;
});

new Promise (resolve => {
	document.readyState === 'complete' ? resolve() : window.onload = resolve;
}).then(() =>{
	return new Promise((resolve, reject) => {
		VK.init({
			apiId: 5570832
		});

		VK.Auth.login(response => {
			response.session ? resolve(response) : reject(new Error('Не удалос авторизоваться'));
		}, 2);
	});
}).then(() => {
	return new Promise((resolve, reject) => {
		VK.api('users.get', {'name_case': 'gen'}, (response) => {
			if(response.error) 
				reject(new Error(response.error.error_msg));
			else {
				console.log('GET USER NAME');
				headerInfo.textContent = `Друзья ${response.response[0].first_name} ${response.response[0].last_name}`;
				resolve();
			}
		});
	})
}).then(() => {
	return new Promise((resolve, reject) => {
		VK.api('friends.get', {fields: 'bdate, photo_200'}, friendsList => {
			if(friendsList.error) 
				reject(new Error(response.error.error_msg));
			else{
				console.log('GET FRIENDS LIST');
				console.log(friendsList);

				let source = friendPostTemplate.innerHTML;
				let tamplateFn = Handlebars.compile(source);
				let tamplate = tamplateFn({list: friendsList.response});

				friendsListContainer.innerHTML = tamplate;

				resolve();
			}
		})
	});
}).catch(function(e) {
	alert(`Ошибка: ${e.message}`);
});