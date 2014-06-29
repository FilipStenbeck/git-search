var remoteUrl = 'https://github.com/FilipStenbeck/tweetflow',
	relativeRootPath = '../../tweetflow'

module.exports = {
	getLocalGitFolder : function () {
		return relativeRootPath + '/.git';
	}
}