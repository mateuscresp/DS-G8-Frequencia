import logo from '../../assets/figma/40052.svg'
import profile from '../../assets/figma/bc690.svg'
import account from '../../assets/figma/71178.svg'
import home from '../../assets/figma/f18da.svg'
import groups from '../../assets/figma/0bf8e.svg'
import check from '../../assets/figma/b6144.svg'
import history from '../../assets/figma/e14d8.svg'
import bell from '../../assets/figma/f9d65.svg'
import search from '../../assets/figma/d12f4.svg'
import send from '../../assets/figma/91994.svg'
import scanner from '../../assets/figma/98320.svg'
import ring from '../../assets/figma/06bc6.svg'
import timer from '../../assets/figma/550dc.svg'
import info from '../../assets/figma/f1bab.svg'
import classroom from '../../assets/figma/12f70.svg'
import chevron from '../../assets/figma/da0fd.svg'
import quickGroups from '../../assets/figma/9763d.svg'
import quickCheck from '../../assets/figma/3301a.svg'
import quickArrow from '../../assets/figma/e988f.svg'
import book from '../../assets/figma/583a4.svg'
const icons = { logo, profile, account, home, groups, check, history, bell, search, send, scanner, ring, timer, info, classroom, chevron, quickGroups, quickCheck, quickArrow, book }
export default function DesignIcon({ name }: { name: keyof typeof icons }) {
 return <img className="design-icon" src={icons[name]} alt="" aria-hidden="true" />
}
