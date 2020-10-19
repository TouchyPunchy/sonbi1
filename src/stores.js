import { readable, writable } from 'svelte/store';

const THEMES = [
    { name: 'sonbi1', dark: '#2B2B2B', light: '#FFFFFF', primary: '#FF9900', secondary: '#393939', body: '#393939'},
    { name: 'carrote', dark: '#000000', light: '#FFFFFF', primary: '#FF99CC', secondary: '#44CC00', body: '#393939'},
    { name: 'blue & orange', dark: '#0000FF', light: '#FFFFFF', primary: '#FFA500', secondary: '#000000', body: '#393939'},
    { name: 'b&w', dark: '#2B2B2B', light: '#FFFFFF', primary: '#BEBEBE', secondary: '#000000', body: '#FFFFFF'},
    // from colourlovers
    { name: '69D2E7', dark: "#69D2E7", light: "#A7DBD8", primary: "#E0E4CC", secondary: "#F38630", body: "#FA6900"},
    { name: '3FB8AF', dark: "#3FB8AF", light: "#7FC7AF", primary: "#DAD8A7", secondary: "#FF9E9D", body: "#FF3D7F"},
    { name: '343838', dark: "#343838", light: "#005F6B", primary: "#008C9E", secondary: "#00B4CC", body: "#00DFFC"},
    { name: 'FF4E50', dark: "#FF4E50", light: "#FC913A", primary: "#F9D423", secondary: "#EDE574", body: "#E1F5C4"},
    { name: 'FF9900', dark: "#FF9900", light: "#424242", primary: "#E9E9E9", secondary: "#BCBCBC", body: "#3299BB"},
    { name: 'EEE6AB', dark: "#EEE6AB", light: "#C5BC8E", primary: "#696758", secondary: "#45484B", body: "#36393B"},
    { name: 'A3A948', dark: "#A3A948", light: "#EDB92E", primary: "#F85931", secondary: "#CE1836", body: "#009989"},
    { name: '515151', dark: "#515151", light: "#FFFFFF", primary: "#00B4FF", secondary: "#EEEEEE", body: '#515151'},
    { name: 'FCFEF5', dark: "#FCFEF5", light: "#E9FFE1", primary: "#CDCFB7", secondary: "#D6E6C3", body: "#FAFBE3"},
    { name: '30261C', dark: "#30261C", light: "#403831", primary: "#36544F", secondary: "#1F5F61", body: "#0B8185"},
    { name: 'AAFF00', dark: "#AAFF00", light: "#FFAA00", primary: "#FF00AA", secondary: "#AA00FF", body: "#00AAFF"},
    { name: 'F6F6F6', dark: "#F6F6F6", light: "#E8E8E8", primary: "#333333", secondary: "#990100", body: "#B90504"},
    { name: 'E4DED0', dark: "#E4DED0", light: "#ABCCBD", primary: "#7DBEB8", secondary: "#181619", body: "#E32F21"},
    { name: '2B222C', dark: "#2B222C", light: "#5E4352", primary: "#965D62", secondary: "#C7956D", body: "#F2D974"},
    { name: 'EB9C4D', dark: "#EB9C4D", light: "#F2D680", primary: "#F3FFCF", secondary: "#BAC9A9", body: "#697060"},
    { name: '44749D', dark: "#44749D", light: "#C6D4E1", primary: "#FFFFFF", secondary: "#EBE7E0", body: "#BDB8AD"},
    { name: 'F6D76B', dark: "#F6D76B", light: "#FF9036", primary: "#D6254D", secondary: "#FF5475", body: "#FDEBA9"},
    { name: 'E7EDEA', dark: "#E7EDEA", light: "#FFC52C", primary: "#FB0C06", secondary: "#030D4F", body: "#CEECEF"},
    { name: '8D7966', dark: "#8D7966", light: "#A8A39D", primary: "#D8C8B8", secondary: "#E2DDD9", body: "#F8F1E9"}
];


// ["#69D2E7","#A7DBD8","#E0E4CC","#F38630","#FA6900"],
// ["#3FB8AF","#7FC7AF","#DAD8A7","#FF9E9D","#FF3D7F"],
// ["#343838","#005F6B","#008C9E","#00B4CC","#00DFFC"],
// ["#FF4E50","#FC913A","#F9D423","#EDE574","#E1F5C4"],
// ["#FF9900","#424242","#E9E9E9","#BCBCBC","#3299BB"],
// ["#EEE6AB","#C5BC8E","#696758","#45484B","#36393B"],
// ["#A3A948","#EDB92E","#F85931","#CE1836","#009989"],
// ["#515151","#FFFFFF","#00B4FF","#EEEEEE"],
// ["#FCFEF5","#E9FFE1","#CDCFB7","#D6E6C3","#FAFBE3"],
// ["#30261C","#403831","#36544F","#1F5F61","#0B8185"],
// ["#AAFF00","#FFAA00","#FF00AA","#AA00FF","#00AAFF"],
// ["#F6F6F6","#E8E8E8","#333333","#990100","#B90504"],
// ["#E4DED0","#ABCCBD","#7DBEB8","#181619","#E32F21"],
// ["#2B222C","#5E4352","#965D62","#C7956D","#F2D974"],
// ["#EB9C4D","#F2D680","#F3FFCF","#BAC9A9","#697060"],
// ["#44749D","#C6D4E1","#FFFFFF","#EBE7E0","#BDB8AD"],
// ["#F6D76B","#FF9036","#D6254D","#FF5475","#FDEBA9"],
// ["#E7EDEA","#FFC52C","#FB0C06","#030D4F","#CEECEF"],
// ["#8D7966","#A8A39D","#D8C8B8","#E2DDD9","#F8F1E9"],

function createThemeStore(theme) {
    const store = writable(theme);

    function set(new_theme){
        store.set(new_theme);
        document.documentElement.style.setProperty('--dark-color', new_theme.dark);
        document.documentElement.style.setProperty('--light-color', new_theme.light);
        document.documentElement.style.setProperty('--primary-color', new_theme.primary);
        document.documentElement.style.setProperty('--secondary-color', new_theme.secondary);
        document.documentElement.style.setProperty('--body-color', new_theme.body);
    }
    return {
        set,
        subscribe: store.subscribe,
        //reset: () => set(themes[0])
    }
}

export const themes = readable(THEMES, () => {});
export const current_theme = createThemeStore(THEMES[0]);