const shape = ({ show, position }) => {
    return <div style={{
        width: '100px',
        height: '100px',
        position: 'absolute',
        top: position?.top,
        transform: 'translate(-50%, -50%)',
        left: position?.left,
        background: 'black',
        borderRadius: '100%',
        display: show ? 'block' : 'none'
    }}>

    </div>
}

export default shape;