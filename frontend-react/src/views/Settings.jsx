import React from 'react';
import { useStore } from '../context/StoreContext';

const Settings = () => {
    const { store, setStore } = useStore();

    const handleUpdate = (path, val) => {
        setStore(prev => {
            const keys = path.split('.');
            let current = { ...prev };
            let node = current;
            for (let i = 0; i < keys.length - 1; i++) {
                node[keys[i]] = { ...node[keys[i]] };
                node = node[keys[i]];
            }
            node[keys[keys.length - 1]] = val;
            return current;
        });
    };

    return (
        <section id="settings" className="view active">
            <h2>Settings</h2>
            <div className="grid two">
                <div className="panel">
                    <h3>Language</h3>
                    <label>
                        System Language
                        <select
                            value={store.settings.language}
                            onChange={(e) => handleUpdate('settings.language', e.target.value)}
                        >
                            <option value="en">English</option>
                            <option value="si">සිංහල</option>
                        </select>
                    </label>
                </div>

                <div className="panel">
                    <h3>Theme</h3>
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                        <label style={{ flexDirection: 'row', gap: '8px' }}>
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                checked={store.settings.theme === 'dark'}
                                onChange={() => handleUpdate('settings.theme', 'dark')}
                            />
                            Dark
                        </label>
                        <label style={{ flexDirection: 'row', gap: '8px' }}>
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                checked={store.settings.theme === 'light'}
                                onChange={() => handleUpdate('settings.theme', 'light')}
                            />
                            Light
                        </label>
                    </div>
                </div>
            </div>

            <div className="panel">
                <h3>Accessibility</h3>
                <div className="grid two">
                    <label>
                        Font Scale
                        <input
                            type="range"
                            min="0.8"
                            max="1.5"
                            step="0.05"
                            value={store.settings.fontScale || 1}
                            onChange={(e) => handleUpdate('settings.fontScale', parseFloat(e.target.value))}
                        />
                        <div style={{ textAlign: 'center' }}>{(store.settings.fontScale || 1).toFixed(2)}x</div>
                    </label>
                </div>
            </div>
        </section>
    );
};

export default Settings;
