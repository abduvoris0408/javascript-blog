function populateProfile() {
	const userData = JSON.parse(localStorage.getItem('user'))

	if (userData) {
		document.getElementById('name').value = userData.full_name || ''
		document.getElementById('email').value = userData.email || ''
		document.getElementById('phone').value = userData.phone_number || ''
	} else {
		alert("Foydalanuvchi ma'lumotlari topilmadi!")
	}
}

document.getElementById('editBtn').addEventListener('click', () => {
	document
		.querySelectorAll('.editable')
		.forEach(input => (input.disabled = false))
	document.getElementById('editBtn').classList.add('hidden')
	document.getElementById('saveBtn').classList.remove('hidden')
})

document.getElementById('saveBtn').addEventListener('click', () => {
	const updatedUser = {
		full_name: document.getElementById('name').value,
		email: document.getElementById('email').value,
		phone_number: document.getElementById('phone').value,
	}

	localStorage.setItem('user', JSON.stringify(updatedUser))

	alert("Ma'lumotlar muvaffaqiyatli saqlandi!")

	document
		.querySelectorAll('.editable')
		.forEach(input => (input.disabled = true))
	document.getElementById('editBtn').classList.remove('hidden')
	document.getElementById('saveBtn').classList.add('hidden')
})

document.addEventListener('DOMContentLoaded', () => {
	const userData = JSON.parse(localStorage.getItem('user'))
	if (userData) {
		document.getElementById('profilePage').classList.remove('hidden')
		populateProfile()
	} else {
		document.getElementById('profilePage').classList.add('hidden')
	}
})

document.addEventListener('DOMContentLoaded', () => {
	const avatarImage = document.getElementById('avatarImage')
	const placeholderIcon = document.getElementById('placeholderIcon')
	const avatarUrlInput = document.getElementById('avatarUrlInput')
	const editAvatarBtn = document.getElementById('editAvatarBtn')
	const avatarModal = document.getElementById('avatarModal')
	const closeModalBtn = document.getElementById('closeModalBtn')
	const saveAvatarBtn = document.getElementById('saveAvatarBtn')

	const userData = JSON.parse(localStorage.getItem('user'))

	// Check if the user has an avatar saved
	if (userData && userData.avatar) {
			avatarImage.src = userData.avatar
			avatarImage.style.display = 'block'  // Show the avatar image
			placeholderIcon.style.display = 'none'  // Hide the placeholder
	} else {
			placeholderIcon.style.display = 'block'  // Show the placeholder if no avatar
			avatarImage.style.display = 'none'  // Hide the avatar image if none
	}

	// Open the modal for avatar change
	editAvatarBtn.addEventListener('click', () => {
			avatarModal.classList.remove('hidden')
			avatarUrlInput.value = ''
			avatarUrlInput.focus()
	})

	// Close the modal without saving
	closeModalBtn.addEventListener('click', () => {
			avatarModal.classList.add('hidden')
	})

	// Save the avatar URL and update the profile
	saveAvatarBtn.addEventListener('click', () => {
			const newAvatarUrl = avatarUrlInput.value.trim()

			if (newAvatarUrl) {
					avatarImage.src = newAvatarUrl
					avatarImage.style.display = 'block'  // Show the avatar image
					placeholderIcon.style.display = 'none'  // Hide the placeholder

					// Store the avatar URL in localStorage
					if (userData) {
							userData.avatar = newAvatarUrl
							localStorage.setItem('user', JSON.stringify(userData))
					} else {
							localStorage.setItem(
									'user',
									JSON.stringify({ avatar: newAvatarUrl })
							)
					}
			}

			avatarModal.classList.add('hidden')
	})
})
