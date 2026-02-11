import { createBrowserRouter } from 'react-router-dom'
import Layout from './layout/Layout'
import Forecast from './views/Forecast'
import Pollutants from './views/Pollutants'
import GiveFeeling from './views/GiveFeeling'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Forecast/>
            },
            {
                path: 'pollutants',
                element: <Pollutants/>
            },
            {
                path: 'giveFeeling',
                element: <GiveFeeling/>
            }
        ]
    }
])