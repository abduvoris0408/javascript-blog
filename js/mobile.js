document.addEventListener('DOMContentLoaded', () => {
	const mobileBtn = document.getElementById('mobilebtn')
	const sidebar = document.getElementById('sidebar')

	mobileBtn.addEventListener('click', () => {
		sidebar.classList.remove('-translate-x-full')
	})

	document.addEventListener('click', event => {
		if (
			!sidebar.contains(event.target) &&
			!mobileBtn.contains(event.target) &&
			!toggleBtn.contains(event.target)
		) {
			sidebar.classList.add('-translate-x-full')
		}
	})
})
