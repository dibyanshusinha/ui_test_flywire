import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TableView from './views/TableView';
import DetailView from './views/DetailView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <TableView />,
  },
  {
    path: '/pokemon/:id',
    element: <DetailView />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
