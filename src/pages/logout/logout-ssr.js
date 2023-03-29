export const handleBeforeState = (req, res) => {
	delete req.session.user
	req.session.save(() => {
		res.redirect('/')
	})
}