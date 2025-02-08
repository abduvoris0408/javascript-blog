document.getElementById('loginForm').addEventListener('submit', async e => {
	e.preventDefault()

	const phone_number = document.getElementById('phone_number').value
	const password = document.getElementById('password').value

	const formData = new FormData()
	formData.append('phone_number', phone_number)
	formData.append('password', password)

	try {
		const response = await fetch(
			'https://asadbek6035.pythonanywhere.com/account/login/',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					phone_number,
					password,
				}),
			}
		)

		const data = await response.json()

		if (data.success) {
			localStorage.setItem('authToken', data.data.token.access)
			localStorage.setItem('user', JSON.stringify(data.data))
			window.location.href = './myblogs.html'
		} else {
			alert('Login failed: ' + data.message)
		}
	} catch (error) {
		console.error('Error:', error.message)
		alert('Login failed')
	}
})
