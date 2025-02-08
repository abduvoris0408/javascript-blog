document.getElementById('registerForm').addEventListener('submit', async e => {
	e.preventDefault()

	const fullname = document.getElementById('fullname').value
	const phone_number = document.getElementById('phone_number').value
	const password = document.getElementById('password').value
	const confirmPassword = document.getElementById('confirm-password').value
	const avatar = document.getElementById('file_avatar').files[0]

	if (password !== confirmPassword) {
		alert('Passwords do not match!')
		return
	}

	const formData = new FormData()
	formData.append('fullname', fullname)
	formData.append('phone_number', phone_number)
	formData.append('password', password)
	formData.append('password2', confirmPassword)
	formData.append('avatar', avatar)

	try {
		const response = await fetch(
			'https://asadbek6035.pythonanywhere.com/account/register/',
			{
				method: 'POST',
				body: formData,
			}
		)

		const data = await response.json()

		if (response.ok) {
			window.location.pathname = './pages/login.html'
		} else {
			alert('Registration failed: ' + data.message)
		}
	} catch (error) {
		console.error('Error:', error.message)
		alert('Registration failed')
	}
})
