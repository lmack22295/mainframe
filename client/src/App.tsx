import { useState } from 'react';
import { Layout } from './components/common/Layout';
import { TaskList } from './components/tasks/TaskList';
import { ChatInterface } from './components/chat/ChatInterface';

function App() {
  const [currentTab, setCurrentTab] = useState<'tasks' | 'chat'>('tasks');

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'tasks' && <TaskList />}
      {currentTab === 'chat' && <ChatInterface />}
    </Layout>
  );
}

export default App;
