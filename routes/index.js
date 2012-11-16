
/*
 * GET home page.
 */

 module.exports = function(articleProvider) {
    return {
        index: function(req, res) {
            articleProvider.findAll(function(error, docs) {
                res.render('index.jade', {
                    title: 'Blog',
                    articles: docs 
                });
            });
        },

        get_new: function(req, res) {
            res.render('blog_new.jade', {
                title: 'New Post'
            });
        },

        post_new: function(req, res) {    articleProvider.save({
            title: req.param('title'),
                body: req.param('body')
            }, function(error, docs) {
                res.redirect('/')
            });   
        },

        get_by_id: function(req, res) {
            articleProvider.findById(req.params.id, function(error, article) {
                res.render('blog_show.jade',
                { 
                    title: article.title,
                    article:article
                });
            });
        },

        add_comment: function(req, res) {
            articleProvider.addCommentToArticle(req.param('_id'), {
                person: req.param('person'),
                comment: req.param('comment'),
                created_at: new Date()
            } , function( error, docs) {
             res.redirect('/blog/' + req.param('_id'))
         });
        },

        not_found: function(req, res, next){
            res.send('what???', 404);
        }


    };
};
