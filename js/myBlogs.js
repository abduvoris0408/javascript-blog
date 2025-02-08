function formatDate(isoString) {
	if (!isoString) return ''

	const date = new Date(isoString)
	const monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	const day = date.getUTCDate()
	const month = monthNames[date.getUTCMonth()]
	const year = date.getUTCFullYear()

	return `${month} ${day}, ${year}`
}

const addblogbtn = document.querySelector('#addblog')
const default_modal = document.querySelector('#default_modal')
const closeModal = document.querySelector('#closeModal')
const declinemodal = document.querySelector('#declinemodal')

addblogbtn.addEventListener('click', event => {
	event.preventDefault()
	default_modal.classList.remove('hidden')
})
declinemodal.addEventListener('click', event => {
	event.preventDefault()
	default_modal.classList.add('hidden')
})
closeModal.addEventListener('click', event => {
	event.preventDefault()
	default_modal.classList.add('hidden')
})

function closeModalfunc() {
	default_modal.classList.add('hidden')
}

default_modal.addEventListener('click', function (event) {
	if (event.target === default_modal) {
		closeModalfunc()
	}
})

function checkAuth() {
	const token = localStorage.getItem('authToken')
	if (!token) {
		alert('Siz tizimga kirmagansiz! Iltimos, avval login qiling.')
		window.location.href = '../pages/login.html'
		return false
	}
	return token
}
async function addBlogFunc(event) {
	event.preventDefault()

	const token = checkAuth()
	if (!token) return

	const title = document.getElementById('title').value.trim()
	const description = document.getElementById('description').value.trim()
	const fileInput = document.getElementById('file').files[0]

	if (!title || !description || !fileInput) {
		alert('Iltimos, barcha maydonlarni to‘ldiring!')
		return
	}

	let formData = new FormData()
	formData.append('title', title)
	formData.append('description', description)
	formData.append('image', fileInput)

	try {
		const addBlogBtn = document.getElementById('addBlog')
		const addBlogLoadingBtn = document.getElementById('addBlogLoading')

		addBlogBtn.classList.add('hidden')
		addBlogLoadingBtn.classList.remove('hidden')

		const response = await fetch(
			'https://asadbek6035.pythonanywhere.com/blog/create/',
			{
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			}
		)

		if (response.ok) {
			document.getElementById('addform').reset()
			document.getElementById('default_modal').classList.add('hidden')
			fetchBlogs()
		} else {
			const errorData = await response.json()
			alert(
				'Xatolik: ' +
					(errorData.message ||
						"Ma'lumot yuborishda xatolik yuz berdi.")
			)
		}
	} catch (error) {
		console.error('Xatolik:', error)
		alert('Tarmoqda xatolik yuz berdi. Iltimos, qaytadan urinib ko‘ring.')
	} finally {
		const addBlogBtn = document.getElementById('addBlog')
		const addBlogLoadingBtn = document.getElementById('addBlogLoading')

		addBlogBtn.classList.remove('hidden')
		addBlogLoadingBtn.classList.add('hidden')
	}
}

document.querySelector('#addBlog').addEventListener('click', addBlogFunc)

// search

document.addEventListener('DOMContentLoaded', function () {
	const searchInput = document.getElementById('searchInput')
	const blogContainer = document.getElementById('blog-container')
	const loadingElement = document.getElementById('loading')

	async function fetchBlogs(searchTerm = '') {
		try {
			loadingElement.classList.remove('hidden')

			const response = await fetch(
				'https://asadbek6035.pythonanywhere.com/blog/list/'
			)
			const blogs = await response.json()

			blogContainer.innerHTML = ''

			const filteredBlogs = blogs.filter(
				blog =>
					blog.title
						.toLowerCase()
						.includes(searchTerm.toLowerCase()) ||
					blog.description
						.toLowerCase()
						.includes(searchTerm.toLowerCase())
			)

			if (filteredBlogs.length === 0) {
				blogContainer.innerHTML =
					'<p class="text-center text-gray-500">No results found.</p>'
			} else {
				filteredBlogs.forEach(blog => {
					const blogCard = `
											<div class="overflow-hidden flex flex-col md:flex-row my-6 bg-white shadow-lg transition-all duration-700 hover:scale-105 hover:shadow-md hover:shadow-blue-700 border border-slate-200 rounded-lg w-full sm:w-[570px] dark:bg-gray-700">
													<div class="relative p-2.5 md:w-2/5 shrink-0 overflow-hidden">
															<img src="${
																blog.image
															}" alt="card-image" class="h-full w-full rounded-md md:rounded-lg object-cover" />
													</div>
													<div class="p-6">
															<div class="mb-4 rounded-full bg-teal-600 py-0.5 px-1 border border-transparent text-xs text-white transition-all shadow-sm w-10 text-center">
																	<div class="flex items-center gap-x-3">
																			<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO-4uBLg3LUazrNOHDUWfLIPQU7L46-z0w74Zth4Cks5_KZWiARdGbx34A8mdS4q33X2SysPQ3GOzG0zhsP_4XFQ"
																					alt="Maria Jimenez" class="relative inline-block h-8 w-8 rounded-full object-cover object-center" />
																			<div class="flex flex-col items-start justify-center">
																					<h6 class="text-slate-800 font-bold dark:text-black">Jude Bellingham</h6>
																					<p class="text-slate-600 text-sm dark:text-white">Jude@gmail.com</p>
																			</div>
																	</div>
															</div>
															<h4 class="mb-2 text-slate-800 text-xl font-bold dark:text-white">${
																blog.title
															}</h4>
															<p class="mb-8 text-slate-600 leading-normal font-light dark:text-white">${
																blog.description
															}</p>
															<div class="flex gap-6">
																	<div class="text-sm text-gray-500 dark:text-white">
																			<p>${formatDate(blog.date_created)}</p>
																	</div>
																	<a href="../pages/blogMore.html?id=${
																		blog.id
																	}" class="text-slate-800 font-semibold text-sm hover:underline flex items-center dark:text-blue-500">
																			Learn More
																			<svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
																					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
																			</svg>
																	</a>
															</div>
													</div>
											</div>
									`
					blogContainer.innerHTML += blogCard
				})
			}
		} catch (error) {
			console.error('Error fetching blogs:', error)
		} finally {
			loadingElement.classList.add('hidden')
		}
	}

	fetchBlogs()

	searchInput.addEventListener('input', function () {
		const searchTerm = searchInput.value.trim()
		fetchBlogs(searchTerm)
	})
})
