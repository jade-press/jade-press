
'use strict'

// since v0.11.0
// add post api:
// 	,'/api/post/preview-html'
// 	,'/api/post/validate-script'

const log = require('../lib/tools').log
const db = require('../lib/db').db

exports.update = function* (ver) {

	//groups to update
	var groups = yield db.collection('group').find({
		access: {
			$elemMatch: {
				$in: [
					'/api/post/update'
					,'/api/post/add'
				]
			}
		}
	})
	.toArray()

	var groupIds = groups.map(function(group) {
		return group._id
	})

	//update groups
	var res1 = yield db.collection('group').updateMany({
		_id: {
			$in: groupIds
		}
	}, {
		$addToSet: {
			access: {
				$each: [
					'/api/post/validate-style'
					,'/api/post/preview-html'
					,'/api/post/validate-script'
				]
			}
		}
	})

	//update users
	for(let i = 0, len = groupIds.length;i < len;i ++) {
		yield updateGroupId(groupIds[i])
	}

}

function* updateGroupId(groupId) {

	let group = yield db.collection('group').findOne({
		_id: groupId
	})

	return yield db.collection('user').updateMany({
		'group._id': groupId
	}, {
		$set: {
			group: group
		}
	})
}