import React from 'react';
import styled from 'styled-components';
import type { IComment, IThreadedComment } from "../../types/discussion.type";
import { Spinner } from "./Spinner";

interface Props {
  comments: IThreadedComment[];
  user: { _id: string; role: string } | null;
  onUpvote: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  replyContent: string;
  onReplyChange: (v: string) => void;
  onReplySubmit: () => void;
  submittingReply: boolean;
}

export function DiscussionComments({
  comments,
  user,
  onUpvote,
  onDelete,
  onEdit,
  replyContent,
  onReplyChange,
  onReplySubmit,
  submittingReply,
}: Props) {
  return (
    <StyledWrapper>
      <div className="card">
        <span className="title">Comments</span>
        
        {comments.length === 0 ? (
          <div className="py-6 text-center text-sm text-gray-500">No comments yet. Start the conversation!</div>
        ) : (
          <div className="comments-list">
            {comments.map((c) => (
              <CommentItem 
                key={c._id} 
                comment={c} 
                user={user} 
                onUpvote={() => onUpvote(c._id)}
                onDelete={() => onDelete(c._id)}
                onEdit={(content) => onEdit(c._id, content)}
              />
            ))}
          </div>
        )}

        <div className="text-box">
          <div className="box-container">
            <textarea 
              placeholder="Reply..." 
              value={replyContent}
              onChange={(e) => onReplyChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (replyContent.trim() && !submittingReply) {
                    onReplySubmit();
                  }
                }
              }}
            />
            <div>
              <div className="formatting">
                <button type="button">
                  <svg fill="none" viewBox="0 0 24 24" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#707277" d="M5 6C5 4.58579 5 3.87868 5.43934 3.43934C5.87868 3 6.58579 3 8 3H12.5789C15.0206 3 17 5.01472 17 7.5C17 9.98528 15.0206 12 12.5789 12H5V6Z" clipRule="evenodd" fillRule="evenodd" />
                    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#707277" d="M12.4286 12H13.6667C16.0599 12 18 14.0147 18 16.5C18 18.9853 16.0599 21 13.6667 21H8C6.58579 21 5.87868 21 5.43934 20.5607C5 20.1213 5 19.4142 5 18V12" />
                  </svg>
                </button>
                <button type="button">
                  <svg fill="none" viewBox="0 0 24 24" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeWidth="2.5" stroke="#707277" d="M12 4H19" />
                    <path strokeLinecap="round" strokeWidth="2.5" stroke="#707277" d="M8 20L16 4" />
                    <path strokeLinecap="round" strokeWidth="2.5" stroke="#707277" d="M5 20H12" />
                  </svg>
                </button>
                <button type="button">
                  <svg fill="none" viewBox="0 0 24 24" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#707277" d="M5.5 3V11.5C5.5 15.0899 8.41015 18 12 18C15.5899 18 18.5 15.0899 18.5 11.5V3" />
                    <path strokeLinecap="round" strokeWidth="2.5" stroke="#707277" d="M3 21H21" />
                  </svg>
                </button>
                <button type="button">
                  <svg fill="none" viewBox="0 0 24 24" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#707277" d="M4 12H20" />
                    <path strokeLinecap="round" strokeWidth="2.5" stroke="#707277" d="M17.5 7.66667C17.5 5.08934 15.0376 3 12 3C8.96243 3 6.5 5.08934 6.5 7.66667C6.5 8.15279 6.55336 8.59783 6.6668 9M6 16.3333C6 18.9107 8.68629 21 12 21C15.3137 21 18 19.6667 18 16.3333C18 13.9404 16.9693 12.5782 14.9079 12" />
                  </svg>
                </button>
                <button type="button">
                  <svg fill="none" viewBox="0 0 24 24" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
                    <circle strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#707277" r={10} cy={12} cx={12} />
                    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#707277" d="M8 15C8.91212 16.2144 10.3643 17 12 17C13.6357 17 15.0879 16.2144 16 15" />
                    <path strokeLinejoin="round" strokeLinecap="round" strokeWidth={3} stroke="#707277" d="M8.00897 9L8 9M16 9L15.991 9" />
                  </svg>
                </button>
                <button 
                  type="button" 
                  className="send" 
                  title="Send"
                  onClick={onReplySubmit}
                  disabled={submittingReply || !replyContent.trim()}
                >
                  {submittingReply ? (
                    <Spinner size="sm" />
                  ) : (
                    <svg fill="none" viewBox="0 0 24 24" height={18} width={18} xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#ffffff" d="M12 5L12 20" />
                      <path strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" stroke="#ffffff" d="M7 9L11.2929 4.70711C11.6262 4.37377 11.7929 4.20711 12 4.20711C12.2071 4.20711 12.3738 4.37377 12.7071 4.70711L17 9" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

function CommentItem({ comment, user, onUpvote, onDelete, onEdit }: {
  comment: IComment;
  user: { _id: string; role: string } | null;
  onUpvote: () => void;
  onDelete: () => void;
  onEdit: (content: string) => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editContent, setEditContent] = React.useState(comment.content);

  const upvoted = user ? comment.upvotes.includes(user._id) : false;
  const authorName = typeof comment.author === "object" ? (comment.author as { name: string }).name : "User";
  const isAuthor = typeof comment.author === "object" && (comment.author as { _id: string })._id === user?._id;

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) + ' at ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="comments">
      <div className="comment-react">
        <button onClick={onUpvote} className={upvoted ? 'active' : ''}>
          <svg fill="none" viewBox="0 0 24 24" height={16} width={16} xmlns="http://www.w3.org/2000/svg">
            <path fill={upvoted ? "#20beff" : "#707277"} strokeLinecap="round" strokeWidth={2} stroke={upvoted ? "#20beff" : "#707277"} d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" />
          </svg>
        </button>
        <hr />
        <span className={upvoted ? 'text-[#20beff]' : ''}>{comment.upvotes.length}</span>
      </div>
      
      <div className="comment-container">
        <div className="user flex justify-between items-start">
          <div className="flex gap-2">
            <div className="user-pic">
              <span className="text-xs font-bold text-gray-500 uppercase">{authorName.charAt(0)}</span>
            </div>
            <div className="user-info">
              <span>{authorName}</span>
              <p>{formatDate(comment.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isEditing && isAuthor && (
              <button onClick={() => setIsEditing(true)} className="text-[10px] text-gray-400 hover:text-[#20beff]">Edit</button>
            )}
            {!isEditing && (user?.role === "admin" || isAuthor) && (
              <button onClick={onDelete} className="text-[10px] text-gray-400 hover:text-red-500">Delete</button>
            )}
          </div>
        </div>
        
        {isEditing ? (
          <div className="mt-1 space-y-2 w-full">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              className="w-full text-sm rounded border border-[#20beff]/50 px-2 py-1.5 focus:border-[#20beff] focus:outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onEdit(editContent);
                  setIsEditing(false);
                }}
                className="text-xs bg-[#20beff] text-white px-2 py-1 rounded hover:bg-[#0f9fdb]"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(false);
                }}
                className="text-xs border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-content">{comment.content}</p>
        )}
      </div>
    </div>
  );
}

const StyledWrapper = styled.div`
  width: 100%;

  .card {
    width: 100%;
    height: fit-content;
    background-color: white;
    box-shadow: inset 0px 5px 15px rgba(0,0,0,0.01);
    border-radius: 0 0 12px 12px;
  }

  .title {
    width: 100%;
    height: 50px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #f1f1f1;
    font-weight: 700;
    font-size: 13px;
    color: #47484b;
  }

  .title::after {
    content: '';
    width: 8ch;
    height: 1px;
    position: absolute;
    bottom: -1px;
    background-color: #20beff;
  }
  
  .comments-list {
    display: flex;
    flex-direction: column;
  }

  .comments {
    display: grid;
    grid-template-columns: 35px 1fr;
    gap: 20px;
    padding: 20px;
    border-bottom: 1px solid #f9fafb;
  }

  .comments:hover {
    .group-hover\\:opacity-100 {
      opacity: 1 !important;
    }
  }

  .comment-react {
    width: 35px;
    height: fit-content;
    display: grid;
    grid-template-columns: auto;
    margin: 0;
    background-color: #f8fafc;
    border-radius: 5px;
    border: 1px solid #f1f5f9;
  }

  .comment-react button {
    width: 35px;
    height: 35px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: 0;
    outline: none;
    cursor: pointer;
  }

  .comment-react button:after {
    content: '';
    width: 40px;
    height: 40px;
    position: absolute;
    left: -2.5px;
    top: -2.5px;
    background-color: rgba(32, 190, 255, 0.15);
    border-radius: 50%;
    z-index: 0;
    transform: scale(0);
  }

  .comment-react button svg {
    position: relative;
    z-index: 9;
    transition: all 0.2s;
  }

  .comment-react button:hover:after {
    animation: ripple 0.6s ease-in-out forwards;
  }

  .comment-react button:hover svg path {
    stroke: #20beff;
    fill: #20beff;
  }
  
  .comment-react button.active svg path {
    stroke: #20beff;
    fill: #20beff;
  }

  .comment-react hr {
    width: 80%;
    height: 1px;
    background-color: #e2e8f0;
    margin: auto;
    border: 0;
  }

  .comment-react span {
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: auto;
    font-size: 12px;
    font-weight: 600;
    color: #94a3b8;
  }

  .comment-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 0;
    margin: 0;
  }

  .comment-container .user {
    display: flex;
    width: 100%;
  }

  .comment-container .user .user-pic {
    width: 36px;
    height: 36px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f1f5f9;
    border-radius: 50%;
  }

  .comment-container .user .user-pic:after {
    content: '';
    width: 8px;
    height: 8px;
    position: absolute;
    right: 0px;
    bottom: 0px;
    border-radius: 50%;
    background-color: #0fc45a;
    border: 2px solid #ffffff;
  }

  .comment-container .user .user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 2px;
  }

  .comment-container .user .user-info span {
    font-weight: 700;
    font-size: 13px;
    color: #334155;
  }

  .comment-container .user .user-info p {
    font-weight: 500;
    font-size: 10px;
    color: #94a3b8;
  }

  .comment-container .comment-content {
    font-size: 13px;
    line-height: 1.5;
    font-weight: 400;
    color: #475569;
    white-space: pre-wrap;
  }

  .text-box {
    width: 100%;
    height: fit-content;
    background-color: #f8fafc;
    padding: 12px;
    border-radius: 0 0 12px 12px;
    border-top: 1px solid #f1f5f9;
  }

  .text-box .box-container {
    background-color: #ffffff;
    border-radius: 8px 8px 21px 21px;
    padding: 8px;
    border: 1px solid #e2e8f0;
    transition: border-color 0.2s;
  }
  
  .text-box .box-container:focus-within {
    border-color: #20beff;
  }

  .text-box textarea {
    width: 100%;
    height: 48px;
    resize: none;
    border: 0;
    border-radius: 6px;
    padding: 12px;
    font-size: 13px;
    outline: none;
    caret-color: #20beff;
    color: #334155;
  }

  .text-box .formatting {
    display: grid;
    grid-template-columns: auto auto auto auto auto 1fr;
    align-items: center;
  }

  .text-box .formatting button {
    width: 32px;
    height: 32px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border-radius: 50%;
    border: 0;
    outline: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .text-box .formatting button:not(.send):hover {
    background-color: #f1f5f9;
  }
  
  .text-box .formatting button:not(.send):hover svg path,
  .text-box .formatting button:not(.send):hover svg circle {
    stroke: #20beff;
  }

  .text-box .formatting .send {
    width: 32px;
    height: 32px;
    background-color: #20beff;
    margin: 0 0 0 auto;
  }
  
  .text-box .formatting .send:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .text-box .formatting .send:not(:disabled):hover {
    background-color: #0f9fdb;
  }

  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 0.6;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
`;
