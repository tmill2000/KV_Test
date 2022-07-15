
export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const queryString = url.search.slice(1).split('&');
		if (queryString[0] === '') {
			const req = new Request('https://errorpage.miller-tyler094.workers.dev');
			const errPage = await fetch(req,
				{
					headers: {
						'content-type': 'text/html;charset=UTF-8',
					},
				}
			)
			return new Response(await errPage.text(), {
				headers: {
					'content-type': 'text/html;charset=UTF-8',
				},
			})
		}
		const key = queryString[0].split('=')[0];
		const value = queryString[0].split('=')[1];
		await env.KV_TEST_V3.put(key, value);
		const list = await env.KV_TEST_V3.list();
		const promiseArr = [];

		list.keys.forEach(({ name: newKey}) => {
			promiseArr.push(env.KV_TEST_V3.get(newKey));
		});
		const res = await Promise.all(promiseArr);

		return new Response(JSON.stringify(res));
	},
};
