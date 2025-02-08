function checkAuth() {
	const token = localStorage.getItem('authToken')
	if (!token) {
		window.location.href = '../pages/login.html'
		return false
	}
	return token
}

function getBlogIdFromURL() {
	const params = new URLSearchParams(window.location.search)
	return params.get('id')
}

async function fetchBlogDetails() {
	const token = checkAuth()
	if (!token) return

	const blogId = getBlogIdFromURL()

	if (!blogId) {
		alert('Blog ID topilmadi!')
		return
	}

	try {
		const response = await fetch(
			`https://asadbek6035.pythonanywhere.com/blog/retrieve/${blogId}/`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)

		if (response.ok) {
			const blogData = await response.json()

			document.getElementById('blogTitle').innerText = blogData.title
			document.getElementById('blogDescription').innerText =
				blogData.description
			document.getElementById('blogImage').src = blogData.image
		} else {
			alert('Blogni yuklashda xatolik!')
		}
	} catch (error) {
		console.error('Xatolik:', error.message)
		alert('Tarmoqda xatolik yuz berdi.')
	}
}
document.addEventListener('DOMContentLoaded', fetchBlogDetails)
// commment

const token = localStorage.getItem('authToken')

document.addEventListener('DOMContentLoaded', async function () {
	const urlParams = new URLSearchParams(window.location.search)
	const blogId = urlParams.get('id')

	if (!blogId) {
		console.error('Blog ID topilmadi!')
		return
	}

	const apiUrl = `https://asadbek6035.pythonanywhere.com/blog/comment/list?id=${blogId}`

	async function loadComments() {
		try {
			const response = await fetch(apiUrl)
			if (!response.ok) {
				throw new Error("Serverdan ma'lumot olib bo‘lmadi")
			}
			const comments = await response.json()

			const commentSection = document.querySelector('#commentList')
			commentSection.innerHTML = ''

			if (!comments || comments.length === 0) {
				commentSection.innerHTML =
					"<p class='text-gray-500 dark:text-gray-400'>Hali hech qanday izoh yo‘q.</p>"
				document.querySelector('#commentsCount').innerText =
					'Discussion (0)'
				return
			}

			comments.reverse().forEach(comment => {
				const authorName = comment.user.full_name || 'Anonymous'
				const authorAvatar =
					comment.user.avatar ||
					'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
				const formattedDate = new Date(
					comment.date_created
				).toDateString()

				const commentHTML = `
									<article class="p-6 mb-6 text-base bg-white rounded-lg dark:bg-gray-900">
											<footer class="flex justify-between items-center mb-2">
													<div class="flex items-center">
															<p class="inline-flex items-center mr-3 font-semibold text-sm text-gray-900 dark:text-white">
																	<img class="mr-2 w-6 h-6 rounded-full" src="${authorAvatar}" alt="${authorName}">
																	${authorName}
															</p>
															<p class="text-sm text-gray-600 dark:text-gray-400">
																	<time pubdate datetime="${comment.date_created}" title="${comment.date_created}">${formattedDate}</time>
															</p>
													</div>
											</footer>
											<p class="text-gray-700 dark:text-gray-300">${comment.description}</p>
											<div class="flex items-center mt-4 space-x-4">
													<button type="button" class="flex items-center font-medium text-sm text-gray-500 hover:underline dark:text-gray-400">
															<svg class="mr-1.5 w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
																	<path d="M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z" />
															</svg> Reply
													</button>
											</div>
									</article>
							`
				commentSection.innerHTML += commentHTML
			})

			document.querySelector(
				'#commentsCount'
			).innerText = `Discussion (${comments.length})`
		} catch (error) {
			console.error('Xatolik yuz berdi:', error)
		}
	}

	loadComments()

	const commentForm = document.getElementById('commentForm')

	if (commentForm) {
		commentForm.addEventListener('submit', async function (event) {
			event.preventDefault()

			const commentText = document.getElementById('comment').value
			const token = localStorage.getItem('authToken')

			if (!commentText) {
				console.error("Komment bo'sh bo'lishi mumkin emas!")
				return
			}

			const dateCreated = new Date().toISOString().split('T')[0]
			try {
				const response = await fetch(
					'https://asadbek6035.pythonanywhere.com/blog/comment/post/',
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify({
							blog: blogId,
							description: commentText,
							date_created: dateCreated,
						}),
					}
				)

				if (!response.ok) {
					throw new Error('Komment yuborishda xatolik yuz berdi!')
				}

				const data = await response.json()
				console.log('Komment muvaffaqiyatli yuborildi', data)

				commentForm.reset()

				await loadComments()
			} catch (error) {
				console.error('Xatolik:', error)
			}
		})
	} else {
		console.error('Comment form topilmadi!')
	}
})
