import {createCommentTemplate} from "./comment.js";
import {createSelectEmojiTemplate} from "./select-emoji.js";

const comments = [{
  emoji: `smile`,
  text: `Interesting setting and a good cast`,
  author: `Tim Macoveev`,
  day: `2019/12/31 23:59`
},
{
  emoji: `sleeping`,
  text: `Booooooooooring`,
  author: `John Doe`,
  day: `2 days ago`
},
{
  emoji: `puke`,
  text: `Very very old. Meh`,
  author: `John Doe`,
  day: `2 days ago`
},
{
  emoji: `angry`,
  text: `Almost two hours? Seriously?`,
  author: `John Doe`,
  day: `Today`
}];

export const createCommentListTemplate = () => {
  const commentsHtml = comments.map((elem) => createCommentTemplate(elem)).join(`\n`);

  return (
    `<section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">4</span></h3>

      <ul class="film-details__comments-list">
        ${commentsHtml}
      </ul>

      <div class="film-details__new-comment">
        <div for="add-emoji" class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          ${createSelectEmojiTemplate(`smile`, false)}
          ${createSelectEmojiTemplate(`sleeping`, false)}
          ${createSelectEmojiTemplate(`puke`, false)}
          ${createSelectEmojiTemplate(`angry`, false)}
        </div>
      </div>
    </section>`
  );
};
