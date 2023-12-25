const notFound = (req, res) => {
    res.status(400).send('Route does not exist')
}

export default notFound