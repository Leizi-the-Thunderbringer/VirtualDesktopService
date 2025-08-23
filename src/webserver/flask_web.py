from flask import Flask, jsonify, request
from flask_cors import CORS
from functools import wraps
import uuid

app = Flask(__name__)
CORS(app)

# 内存中的SPICE会话管理（后续可替换为数据库）
spice_sessions = {}

@app.route('/api/spice/sessions', methods=['GET'])
def list_spice_sessions():
    """获取所有SPICE会话"""
    return jsonify(list(spice_sessions.values()))

@app.route('/api/spice/sessions', methods=['POST'])
def create_spice_session():
    """创建新的SPICE会话"""
    data = request.json
    session_id = str(len(spice_sessions) + 1)
    session = {
        'id': session_id,
        'name': data.get('name', f'SPICE Session {session_id}'),
        'status': 'active'
    }
    spice_sessions[session_id] = session
    return jsonify(session), 201

@app.route('/api/spice/sessions/<session_id>', methods=['DELETE'])
def delete_spice_session(session_id):
    """关闭SPICE会话"""
    if session_id in spice_sessions:
        del spice_sessions[session_id]
        return '', 204
    return jsonify({'error': 'Session not found'}), 404

# 预留虚拟机管理API
@app.route('/api/vm/list', methods=['GET'])
def list_vms():
    return jsonify([])

@app.route('/api/vm/start', methods=['POST'])
def start_vm():
    return jsonify({'result': 'ok'})

@app.route('/api/vm/stop', methods=['POST'])
def stop_vm():
    return jsonify({'result': 'ok'})

# ====== 集群管理 ======
clusters = {
    'default': {
        'id': 'default',
        'name': '默认集群',
        'nodes': ['node1']
    }
}
nodes = {
    'node1': {
        'id': 'node1',
        'hostname': 'localhost',
        'ip': '127.0.0.1',
        'status': 'online'
    }
}

@app.route('/api/clusters', methods=['GET'])
def list_clusters():
    return jsonify(list(clusters.values()))

@app.route('/api/clusters', methods=['POST'])
def create_cluster():
    data = request.json
    cid = str(uuid.uuid4())
    clusters[cid] = {'id': cid, 'name': data['name'], 'nodes': []}
    return jsonify(clusters[cid]), 201

@app.route('/api/clusters/<cid>', methods=['DELETE'])
def delete_cluster(cid):
    if cid in clusters:
        del clusters[cid]
        return '', 204
    return jsonify({'error': 'not found'}), 404

@app.route('/api/nodes', methods=['GET'])
def list_nodes():
    return jsonify(list(nodes.values()))

@app.route('/api/nodes', methods=['POST'])
def create_node():
    data = request.json
    nid = str(uuid.uuid4())
    nodes[nid] = {'id': nid, 'hostname': data['hostname'], 'ip': data['ip'], 'status': 'online'}
    return jsonify(nodes[nid]), 201

@app.route('/api/nodes/<nid>', methods=['DELETE'])
def delete_node(nid):
    if nid in nodes:
        del nodes[nid]
        return '', 204
    return jsonify({'error': 'not found'}), 404

# ====== RBAC & 用户管理 ======
users = {
    'admin': {'username': 'admin', 'password': 'admin', 'roles': ['admin']}
}
roles = {
    'admin': {'permissions': ['*']},
    'user': {'permissions': ['view']}
}
sessions = {}

def check_auth(token, perm=None):
    user = sessions.get(token)
    if not user:
        return False
    if perm is None:
        return True
    for role in user['roles']:
        if '*' in roles.get(role, {}).get('permissions', []):
            return True
        if perm in roles.get(role, {}).get('permissions', []):
            return True
    return False

def require_auth(perm=None):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            token = request.headers.get('Authorization')
            if not token or not check_auth(token, perm):
                return jsonify({'error': 'unauthorized'}), 401
            return f(*args, **kwargs)
        return wrapper
    return decorator

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    ad_server = data.get('ad_server')
    ad_domain = data.get('ad_domain')
    # 本地用户
    user = users.get(username)
    if user and user['password'] == password:
        token = str(uuid.uuid4())
        sessions[token] = user
        return jsonify({'token': token, 'username': username, 'roles': user['roles']})
    # AD认证
    if ad_server and ad_domain:
        try:
            import ldap3
            server = ldap3.Server(ad_server)
            conn = ldap3.Connection(server, user=f'{username}@{ad_domain}', password=password)
            if conn.bind():
                # AD用户自动同步到本地
                if username not in users:
                    users[username] = {'username': username, 'password': '', 'roles': ['user']}
                token = str(uuid.uuid4())
                sessions[token] = users[username]
                return jsonify({'token': token, 'username': username, 'roles': users[username]['roles']})
        except Exception as e:
            pass
    return jsonify({'error': 'invalid credentials'}), 401

@app.route('/api/userinfo', methods=['GET'])
@require_auth()
def userinfo():
    token = request.headers.get('Authorization')
    user = sessions.get(token)
    return jsonify({'username': user['username'], 'roles': user['roles']})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
