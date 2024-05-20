export default (req, res) => {
    if (req.method === 'POST') {
        const data = req.body;
        // Handle drawing data
        res.status(200).json({ success: true });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
