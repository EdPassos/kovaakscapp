

class Category {
    constructor(name, color, parent) {
        this.name = name;
        this.color = color;
        this.parent = parent;
    }
}

const CLICKING = new Category("Clicking", "#cc0000", null);
const TRACKING = new Category("Tracking", "#1155cc", null);
const SWITCHING = new Category("Switching", "#351c75", null);
const DYNAMIC_CLICKING = new Category("Dynamic Clicking", "#f1c232", CLICKING);
const STATIC_CLICKING = new Category("Static Clicking", "#e06666", CLICKING);
const STRAFE_CLICKING = new Category("Strafe Clicking", "#fc74fc", CLICKING);
const PRECISE_TRACKING = new Category("Precise Tracking", "#45818e", TRACKING);
const REACTIVE_TRACKING = new Category("Reactive Tracking", "#3c78d8", TRACKING);
const STRAFE_TRACKING = new Category("Strafe Tracking", "#fc74fc", TRACKING);
const SPEED_SWITCHING = new Category("Speed Switching", "#sa64d79", SWITCHING);
const EVASIVE_SWITCHING = new Category("Evasive Switching", "#674ea7", SWITCHING);

const CATEGORIES = {
    CLICKING,
    TRACKING,
    SWITCHING,
    DYNAMIC_CLICKING,
    STATIC_CLICKING,
    STRAFE_CLICKING,
    PRECISE_TRACKING,
    REACTIVE_TRACKING,
    STRAFE_TRACKING,
    SPEED_SWITCHING,
    EVASIVE_SWITCHING
};

export default CATEGORIES;