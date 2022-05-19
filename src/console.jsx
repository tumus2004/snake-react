let style = `text-shadow: 1px 1px 3px black, 2px 2px 2px black, 0 0 4px red, 2px 2px 4px red, -2px -2px 4px red; 
color: red; font-weight: 900;  background-image: linear-gradient(to right, black , rgb(108, 108, 108));`;
const brand = String.raw`%c
                                                        
  /\      _________              __                /\   
  \ \    /   _____/ ____ _____  |  | __ ____      / /   
   \ \   \_____  \ /    \\__  \ |  |/ // __ \    / /    
    \ \  /        \   |  \/ __ \|    <\  ___/   / /     
     \ \/_______  /___|  (____  /__|_ \\___  > / /      
      \/        \/     \/     \/     \/    \/  \/       
                                                        
`;
export const consoleBranding = () => console.log(brand, style);
