// 定义类别名称常量
export const CATEGORIES = {
    ANIMALS: {en: 'animals', zh: '动物'},
    VEHICLES: {en: 'vehicles', zh: '交通工具'},
    FURNITURE: {en: 'furniture', zh: '家具'},
    FOOD: {en: 'food', zh: '食物'},
    SPORTS: {en: 'sports', zh: '运动'},
    CONTAINERS: {en: 'containers', zh: '容器'},
    ELECTRONICS: {en: 'electronics', zh: '电子产品'},
    EVERYDAY_ITEMS: {en: 'everyday_items', zh: '日常物品'},
    HOUSEHOLD: {en: 'household', zh: '家居用品'},
    HUMAN: {en: 'human', zh: '人物'},
} as const;

// 为每个标签提供中文名称的映射
export const LABELS = {

    // Human 人类
    'person': {en: 'person', zh: '人物'},

    // Vehicles 交通工具
    'bicycle': {en: 'bicycle', zh: '自行车'},
    'car': {en: 'car', zh: '汽车'},
    'motorcycle': {en: 'motorcycle', zh: '摩托车'},
    'airplane': {en: 'airplane', zh: '飞机'},
    'bus': {en: 'bus', zh: '公共汽车'},
    'train': {en: 'train', zh: '火车'},
    'truck': {en: 'truck', zh: '卡车'},
    'boat': {en: 'boat', zh: '船'},
    'traffic_light': {en: 'traffic_light', zh: '交通信号灯'},
    'fire_hydrant': {en: 'fire_hydrant', zh: '消防栓'},
    'stop_sign': {en: 'stop_sign', zh: '停车标志'},
    'parking_meter': {en: 'parking_meter', zh: '停车计时器'},

    // Furniture 家具
    'bench': {en: 'bench', zh: '长椅'},
    'chair': {en: 'chair', zh: '椅子'},
    'couch': {en: 'couch', zh: '沙发'},
    'potted_plant': {en: 'potted_plant', zh: '盆栽'},
    'bed': {en: 'bed', zh: '床'},
    'dining_table': {en: 'dining_table', zh: '餐桌'},
    'toilet': {en: 'toilet', zh: '厕所'},

    // Food 食物
    'banana': {en: 'banana', zh: '香蕉'},
    'apple': {en: 'apple', zh: '苹果'},
    'sandwich': {en: 'sandwich', zh: '三明治'},
    'orange': {en: 'orange', zh: '橙子'},
    'broccoli': {en: 'broccoli', zh: '西兰花'},
    'carrot': {en: 'carrot', zh: '胡萝卜'},
    'hot_dog': {en: 'hot_dog', zh: '热狗'},
    'pizza': {en: 'pizza', zh: '披萨'},
    'donut': {en: 'donut', zh: '甜甜圈'},
    'cake': {en: 'cake', zh: '蛋糕'},

    // Sports 运动
    'frisbee': {en: 'frisbee', zh: '飞盘'},
    'skis': {en: 'skis', zh: '滑雪板'},
    'snowboard': {en: 'snowboard', zh: '滑雪板'},
    'sports_ball': {en: 'sports_ball', zh: '运动球'},
    'kite': {en: 'kite', zh: '风筝'},
    'baseball_bat': {en: 'baseball_bat', zh: '棒球棒'},
    'baseball_glove': {en: 'baseball_glove', zh: '棒球手套'},
    'skateboard': {en: 'skateboard', zh: '滑板'},
    'surfboard': {en: 'surfboard', zh: '冲浪板'},
    'tennis_racket': {en: 'tennis_racket', zh: '网球拍'},

    // Containers 容器
    'bottle': {en: 'bottle', zh: '瓶子'},
    'wine_glass': {en: 'wine_glass', zh: '酒杯'},
    'cup': {en: 'cup', zh: '杯子'},
    'fork': {en: 'fork', zh: '叉子'},
    'knife': {en: 'knife', zh: '刀'},
    'spoon': {en: 'spoon', zh: '勺子'},
    'bowl': {en: 'bowl', zh: '碗'},

    // Electronics 电子产品
    'tv': {en: 'tv', zh: '电视'},
    'laptop': {en: 'laptop', zh: '笔记本电脑'},
    'mouse': {en: 'mouse', zh: '鼠标'},
    'remote': {en: 'remote', zh: '遥控器'},
    'keyboard': {en: 'keyboard', zh: '键盘'},
    'cell_phone': {en: 'cell_phone', zh: '手机'},
    'microwave': {en: 'microwave', zh: '微波炉'},
    'oven': {en: 'oven', zh: '烤箱'},
    'toaster': {en: 'toaster', zh: '烤面包机'},
    'sink': {en: 'sink', zh: '水槽'},
    'refrigerator': {en: 'refrigerator', zh: '冰箱'},

    // Everyday Items 日常物品
    'backpack': {en: 'backpack', zh: '背包'},
    'umbrella': {en: 'umbrella', zh: '雨伞'},
    'handbag': {en: 'handbag', zh: '手袋'},
    'tie': {en: 'tie', zh: '领带'},
    'suitcase': {en: 'suitcase', zh: '行李箱'},
    'scissors': {en: 'scissors', zh: '剪刀'},
    'teddy_bear': {en: 'teddy_bear', zh: '泰迪熊'},
    'hair_dryer': {en: 'hair_dryer', zh: '吹风机'},
    'toothbrush': {en: 'toothbrush', zh: '牙刷'},

    // Household 家居用品
    'book': {en: 'book', zh: '书'},
    'clock': {en: 'clock', zh: '时钟'},
    'vase': {en: 'vase', zh: '花瓶'},

    // Animals 动物
    'cat': {en: 'cat', zh: '猫'},
    'dog': {en: 'dog', zh: '狗'},
    'horse': {en: 'horse', zh: '马'},
    'sheep': {en: 'sheep', zh: '羊'},
    'cow': {en: 'cow', zh: '牛'},
    'elephant': {en: 'elephant', zh: '大象'},
    'bear': {en: 'bear', zh: '熊'},
    'zebra': {en: 'zebra', zh: '斑马'},
    'giraffe': {en: 'giraffe', zh: '长颈鹿'},
    'bird': {en: 'bird', zh: '鸟'}
};


// 创建标签到类别的映射（使用 Map 实现高效查找）
export const LABEL_TO_CATEGORY = new Map<string, { en: string, zh: string }>([
    // Human 人类
    ['person', CATEGORIES.HUMAN],
    // Vehicles 交通工具
    ['bicycle', CATEGORIES.VEHICLES],
    ['car', CATEGORIES.VEHICLES],
    ['motorcycle', CATEGORIES.VEHICLES],
    ['airplane', CATEGORIES.VEHICLES],
    ['bus', CATEGORIES.VEHICLES],
    ['train', CATEGORIES.VEHICLES],
    ['truck', CATEGORIES.VEHICLES],
    ['boat', CATEGORIES.VEHICLES],
    ['traffic_light', CATEGORIES.VEHICLES],
    ['fire_hydrant', CATEGORIES.VEHICLES],
    ['stop_sign', CATEGORIES.VEHICLES],
    ['parking_meter', CATEGORIES.VEHICLES],

    // Furniture 家具
    ['bench', CATEGORIES.FURNITURE],
    ['chair', CATEGORIES.FURNITURE],
    ['couch', CATEGORIES.FURNITURE],
    ['potted_plant', CATEGORIES.FURNITURE],
    ['bed', CATEGORIES.FURNITURE],
    ['dining_table', CATEGORIES.FURNITURE],
    ['toilet', CATEGORIES.FURNITURE],

    // Food 食物
    ['banana', CATEGORIES.FOOD],
    ['apple', CATEGORIES.FOOD],
    ['sandwich', CATEGORIES.FOOD],
    ['orange', CATEGORIES.FOOD],
    ['broccoli', CATEGORIES.FOOD],
    ['carrot', CATEGORIES.FOOD],
    ['hot_dog', CATEGORIES.FOOD],
    ['pizza', CATEGORIES.FOOD],
    ['donut', CATEGORIES.FOOD],
    ['cake', CATEGORIES.FOOD],

    // Sports 运动
    ['frisbee', CATEGORIES.SPORTS],
    ['skis', CATEGORIES.SPORTS],
    ['snowboard', CATEGORIES.SPORTS],
    ['sports_ball', CATEGORIES.SPORTS],
    ['kite', CATEGORIES.SPORTS],
    ['baseball_bat', CATEGORIES.SPORTS],
    ['baseball_glove', CATEGORIES.SPORTS],
    ['skateboard', CATEGORIES.SPORTS],
    ['surfboard', CATEGORIES.SPORTS],
    ['tennis_racket', CATEGORIES.SPORTS],

    // Containers 容器
    ['bottle', CATEGORIES.CONTAINERS],
    ['wine_glass', CATEGORIES.CONTAINERS],
    ['cup', CATEGORIES.CONTAINERS],
    ['fork', CATEGORIES.CONTAINERS],
    ['knife', CATEGORIES.CONTAINERS],
    ['spoon', CATEGORIES.CONTAINERS],
    ['bowl', CATEGORIES.CONTAINERS],

    // Electronics 电子产品
    ['tv', CATEGORIES.ELECTRONICS],
    ['laptop', CATEGORIES.ELECTRONICS],
    ['mouse', CATEGORIES.ELECTRONICS],
    ['remote', CATEGORIES.ELECTRONICS],
    ['keyboard', CATEGORIES.ELECTRONICS],
    ['cell_phone', CATEGORIES.ELECTRONICS],
    ['microwave', CATEGORIES.ELECTRONICS],
    ['oven', CATEGORIES.ELECTRONICS],
    ['toaster', CATEGORIES.ELECTRONICS],
    ['sink', CATEGORIES.ELECTRONICS],
    ['refrigerator', CATEGORIES.ELECTRONICS],

    // Everyday Items 日常物品
    ['backpack', CATEGORIES.EVERYDAY_ITEMS],
    ['umbrella', CATEGORIES.EVERYDAY_ITEMS],
    ['handbag', CATEGORIES.EVERYDAY_ITEMS],
    ['tie', CATEGORIES.EVERYDAY_ITEMS],
    ['suitcase', CATEGORIES.EVERYDAY_ITEMS],
    ['scissors', CATEGORIES.EVERYDAY_ITEMS],
    ['teddy_bear', CATEGORIES.EVERYDAY_ITEMS],
    ['hair_dryer', CATEGORIES.EVERYDAY_ITEMS],
    ['toothbrush', CATEGORIES.EVERYDAY_ITEMS],

    // Household 家居用品
    ['book', CATEGORIES.HOUSEHOLD],
    ['clock', CATEGORIES.HOUSEHOLD],
    ['vase', CATEGORIES.HOUSEHOLD],

    // Animals 动物
    ['cat', CATEGORIES.ANIMALS],
    ['dog', CATEGORIES.ANIMALS],
    ['horse', CATEGORIES.ANIMALS],
    ['sheep', CATEGORIES.ANIMALS],
    ['cow', CATEGORIES.ANIMALS],
    ['elephant', CATEGORIES.ANIMALS],
    ['bear', CATEGORIES.ANIMALS],
    ['zebra', CATEGORIES.ANIMALS],
    ['giraffe', CATEGORIES.ANIMALS],
    ['bird', CATEGORIES.ANIMALS]
]);

// 获取标签所属大类的函数，支持英文和中文返回
export function getCategoryByLabel(label: string, lang: 'en' | 'zh' = 'en'): string | undefined {
    const category = LABEL_TO_CATEGORY.get(label);
    return category ? category[lang] : undefined;
}

// 获取标签所属大类的函数，支持英文和中文返回
export function getCategoryName(label: string, lang: 'en' | 'zh' = 'en'): string | undefined {
    const category = CATEGORIES[label];
    return category ? category[lang] : undefined;
}

// 获取标签的小分类名称
export function getLabelName(label: string, lang: 'en' | 'zh' = 'en'): string | undefined {
    const labelInfo = LABELS[label];
    return labelInfo ? labelInfo[lang] : undefined;
}

// 获取标签的中文名称
export const getZhCategoryNameByEnName = (enName: string): string | undefined => {
    const category = Object.values(CATEGORIES).find(cat => cat.en.toLowerCase() === enName.toLowerCase());
    return category?.zh;
};
// 获取标签的中文名称
export const getZhLabelNameByEnName = (enName: string): string | undefined => {
    const labelInfo = LABELS[enName.toLowerCase()];
    return labelInfo?.zh;
};

// 使用示例
// console.log(getLabelName('person')); // 输出: 'person' (英文)
// console.log(getLabelName('person', 'zh')); // 输出: '人' (中文)
