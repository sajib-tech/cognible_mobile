/* eslint-disable */
import { Model } from '@nozbe/watermelondb'
import { field, relation, children, action,date, readonly } from '@nozbe/watermelondb/decorators';

export default class Post extends Model {
    static table = 'posts'
    static associations = {
      comments: { type: 'has_many', foreignKey: 'post_id' },
    }

    @field('title')
    title;
  
    @field('subtitle')
    subtitle;
  
    @field('body')
    body;

    @readonly @date('created_at') 
    createdAt; 

    @readonly @date('updated_at') 
    updatedAt;

    // @action async addComment(body) {
    //   return this.collections.get('comments').create((comment) => {
    //     comment.post.set(this);
    //     comment.body = body;
    //   });
    // }

   
  }
  
