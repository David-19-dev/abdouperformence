import React from 'react';
import Blog from './Blog';

const BlogPage: React.FC = () => {
  return (
    <main className="pt-16">
      <div className="bg-gray-50 py-20">
        <Blog />
      </div>
    </main>
  );
};

export default BlogPage;