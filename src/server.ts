import express, { json } from 'express';

export default function () {
    const PORT = 5001;

    const app = express();

    app.use(json());

    app.get('/*', (req, res) => {
        res.status(404).send('<h1>Page not found!!!</h1>');
    })

    app.listen(PORT, async () => {
        console.log(`Server listen on port ${PORT}.`);
    })
}