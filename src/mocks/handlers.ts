import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:8000/api/content/:page', ({ params }) => {
    const page = params.page;
    return HttpResponse.json({
      id: 1,
      page,
      title: 'Sample Title',
      content: 'Sample content for ' + page,
      image_url: 'https://example.com/image.jpg',
    });
  }),
];
