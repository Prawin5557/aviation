import {createRoot} from 'react-dom/client';
import AppRoot from '@/src/app/AppRoot';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AppRoot />,
);
