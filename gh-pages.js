var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/eugencelim/eugencelim.github.io', // Update to point to your repository  
        user: {
            name: 'eugencelim', // update to use your name
            email: 'eugence.lim@fusionexgroup.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)