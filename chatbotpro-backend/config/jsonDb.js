const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, 'mock_db.json');

const initDb = () => {
  if (!fs.existsSync(dbFilePath)) {
    const defaultData = {
      users: [],
      botconfigs: [],
      conversations: []
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
};

const readData = () => {
  initDb();
  try {
    const content = fs.readFileSync(dbFilePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading JSON DB:', error);
    return { users: [], botconfigs: [], conversations: [] };
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to JSON DB:', error);
  }
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const jsonDb = {
  find: async (collection, query = {}) => {
    const data = readData();
    const items = data[collection] || [];
    
    return items.filter(item => {
      for (const key in query) {
        // Handle basic queries like botOwner or owner IDs
        if (query[key] && typeof query[key] === 'object' && query[key].toString) {
          if (item[key] !== query[key].toString()) return false;
        } else if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  },

  findOne: async (collection, query = {}) => {
    const data = readData();
    const items = data[collection] || [];
    
    const found = items.find(item => {
      for (const key in query) {
        if (query[key] && typeof query[key] === 'object' && query[key].toString) {
          if (item[key] !== query[key].toString()) return false;
        } else if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });

    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  findById: async (collection, id) => {
    const data = readData();
    const items = data[collection] || [];
    const found = items.find(item => item._id === id.toString());
    return found ? JSON.parse(JSON.stringify(found)) : null;
  },

  create: async (collection, itemData) => {
    const data = readData();
    if (!data[collection]) data[collection] = [];
    
    const newItem = {
      _id: generateId(),
      ...itemData
    };
    
    data[collection].push(newItem);
    writeData(data);
    return JSON.parse(JSON.stringify(newItem));
  },

  findOneAndUpdate: async (collection, query, updateData) => {
    const data = readData();
    const items = data[collection] || [];
    
    const index = items.findIndex(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });

    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...updateData
      };
      writeData(data);
      return JSON.parse(JSON.stringify(items[index]));
    }
    return null;
  },

  findOneAndDelete: async (collection, query) => {
    const data = readData();
    const items = data[collection] || [];
    
    const index = items.findIndex(item => {
      for (const key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });

    if (index !== -1) {
      const deletedItem = items.splice(index, 1)[0];
      writeData(data);
      return JSON.parse(JSON.stringify(deletedItem));
    }
    return null;
  }
};

module.exports = jsonDb;
