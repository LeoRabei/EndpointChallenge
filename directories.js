//Object to represent a directory
let directoryStructure = {
    "": {}
};

/**
 * Create a new directory in the structure
 * @param {string} path - The path where the directory should be created, separated by '/'
 */
function createDirectory(path) {
    const segments = path.split('/');
    let currentLevel = directoryStructure;

    for (let segment of segments) {
        if (!currentLevel[segment]) {
            currentLevel[segment] = {};
        }
        currentLevel = currentLevel[segment];
    }
    return `CREATE ${path}`;
}

/**
 * Move a directory from one path to another
 * @param {string} fromPath - The original path of the directory
 * @param {string} toPath - The new path for the directory
 */
function moveDirectory(fromPath, toPath) {
    const fromSegments = fromPath.split('/');
    const toSegments = toPath.split('/');

    let fromLevel = directoryStructure;
    let toLevel = directoryStructure;

    // Traverse to the directory to move
    for (let segment of fromSegments.slice(0, -1)) {
        fromLevel = fromLevel[segment];
        if (!fromLevel) return `Cannot move ${fromPath}`;
    }
    const directoryToMove = fromLevel[fromSegments[fromSegments.length - 1]];

    // Traverse to the destination directory
    for (let segment of toSegments) {
        if (!toLevel[segment]) {
            toLevel[segment] = {};
        }
        toLevel = toLevel[segment];
    }

    // Move the directory if it exists
    if (directoryToMove) {
        toLevel[fromSegments[fromSegments.length - 1]] = directoryToMove;
        delete fromLevel[fromSegments[fromSegments.length - 1]];
        return `MOVE ${fromPath} ${toPath}`;
    } else {
        return `Cannot move ${fromPath}`;
    }
}

//Delete a directory if it exists
function deleteDirectory(path) {
    const segments = path.split('/');
    let level = directoryStructure;

    for (let i = 0; i < segments.length - 1; i++) {
        level = level[segments[i]];
        if (!level) return `Cannot delete ${path} - ${segments[0]} does not exist`;
    }

    if (level[segments[segments.length - 1]]) {
        delete level[segments[segments.length - 1]];
        return `DELETE ${path}`;
    } else {
        return `Cannot delete ${path} - ${segments[0]} does not exist`;
    }
}

//List the current directory structure
function listStructure() {
    let result = "";
    function printTree(tree, prefix = '') {
        for (let key in tree) {
            if (key !== "") {  // Skip the root
                result += prefix + key + "\n";
                printTree(tree[key], prefix + "  ");
            }
        }
    }
    printTree(directoryStructure);
    return result.trim();
}


// Execute a command based on the provided command string
function executeCommand(command) {
    const parts = command.split(' ');
    const operation = parts[0];

    switch (operation) {
        case 'CREATE':
            return `${createDirectory(parts.slice(1).join(' '))}`;
        case 'MOVE':
            return `${moveDirectory(parts[1], parts.slice(2).join(' '))}`;
        case 'DELETE':
            return `${deleteDirectory(parts.slice(1).join(' '))}`;
        case 'LIST':
            return `${listStructure()}`;
        default:
            return `Unknown command: ${operation}`;
    }
}

// Predefined commands array
const commands = [
    "CREATE fruits",
    "CREATE vegetables",
    "CREATE grains",
    "CREATE fruits/apples",
    "CREATE fruits/apples/fuji",
    "LIST",
    "CREATE grains/squash",
    "MOVE grains/squash vegetables",
    "CREATE foods",
    "MOVE grains foods",
    "MOVE fruits foods",
    "MOVE vegetables foods",
    "LIST",
    "DELETE fruits/apples",
    "DELETE foods/fruits/apples",
    "LIST"
];

// Execute each command and collect output
let output = "";
for (let command of commands) {
    output += executeCommand(command) + "\n";
}

// Print the final output
console.log(output.trim());