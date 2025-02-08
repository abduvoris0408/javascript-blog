export function fetcher(url) {}

export async function POST(url, body = {}) {
	try {
		const response = await fetch(
			url,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
			},
			body
		)
		const res = await response.json()
		return { data: res, success: true }
	} catch (error) {
		return { success: false, message: error?.message }
	}
}

export async function GET(url) {
	try {
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'GET',
		})
		const res = await response.json()
		return { data: res, success: true }
	} catch (error) {
		return { success: false, message: error?.message }
	}
}
