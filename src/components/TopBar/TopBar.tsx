import React, { useRef } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    TextField,
    Button,
    Box,
    IconButton,
    Menu,
    MenuItem,
    // Chip
} from '@mui/material';
import {
    FileDownload,
    FileUpload,
    Menu as MenuIcon,
    Image,
    Description,
    FiberNew
} from '@mui/icons-material';
import { saveAs } from 'file-saver';
// import html2canvas from 'html2canvas';
import * as htmlToImage from "html-to-image";
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setProjectName, markSaved, resetProject, loadProject } from '../../store/projectSlice';
import { clearNodes, setNodes } from '../../store/nodesSlice';
import { clearEdges, setEdges } from '../../store/edgesSlice';
import { clearSelection } from '../../store/selectionSlice';

interface TopBarProps {
    onMenuToggle: () => void;
    sidebarOpen: boolean;
}

const downloadImage = (dataUrl: string, fileName: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    a.click();
    a.remove();
};

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle, sidebarOpen }) => {
    const dispatch = useAppDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);
    // const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [exportMenuAnchor, setExportMenuAnchor] = React.useState<null | HTMLElement>(null);
    const [importMenuAnchor, setImportMenuAnchor] = React.useState<null | HTMLElement>(null);

    const { projectName, isDirty } = useAppSelector((state) => state.project);
    const { nodes } = useAppSelector((state) => state.nodes);
    const { edges } = useAppSelector((state) => state.edges);

    const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setProjectName(event.target.value));
    };

    const handleExportJSON = () => {
        const projectData = {
            projectName,
            nodes,
            edges,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(projectData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        saveAs(dataBlob, `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`);
        dispatch(markSaved());
        setExportMenuAnchor(null);
    };

    const handleExportImage = async () => {

        const canvasElement = document.querySelector('.react-flow') as HTMLElement;
        if (!canvasElement) {
            console.error('Canvas element not found');
            return;
        }

        try {
            // const canvas = await html2canvas(canvasElement, {
            //     backgroundColor: '#ffffff',
            //     scale: 5,
            //     logging: false,
            //     allowTaint: true,
            //     useCORS: true
            // });

            // canvas.toBlob((blob) => {
            //     if (blob) {
            //         saveAs(blob, `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`);
            //     }
            // }, 'image/png');


            // console.log('rw: ',reactFlowWrapper)
            // if (!reactFlowWrapper.current) return;

            const wrapper = document.querySelector(".react-flow") as HTMLElement;
            console.log('w: ', wrapper)
            if (!wrapper) return;

            try {
                const dataUrl = await htmlToImage.toPng(wrapper, {
                    backgroundColor: "white",
                    pixelRatio: 2,
                });

                downloadImage(dataUrl, `${projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}2.png`);
            } catch (err) {
                console.error("Error capturing React Flow chart:", err);
            }


            setExportMenuAnchor(null);
        } catch (error) {
            console.error('Error exporting image:', error);
        }
    };

    const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const projectData = JSON.parse(e.target?.result as string);

                // Validate the project data structure
                if (!projectData.nodes || !projectData.edges) {
                    alert('Invalid project file format. Missing nodes or edges data.');
                    return;
                }

                // Clear current data
                dispatch(clearNodes());
                dispatch(clearEdges());
                dispatch(clearSelection());

                // Load project metadata
                dispatch(loadProject({
                    projectName: projectData.projectName || 'Imported Project',
                    lastSaved: projectData.exportedAt
                }));

                // Load nodes and edges
                dispatch(setNodes(projectData.nodes || []));
                dispatch(setEdges(projectData.edges || []));

                console.log('Project imported successfully:', projectData.projectName);

            } catch (error) {
                console.error('Error importing project:', error);
                alert('Error importing project file. Please check the file format.');
            }
        };

        reader.readAsText(file);
        setImportMenuAnchor(null);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleNewProject = () => {
        if (isDirty) {
            const confirmNew = window.confirm(
                'You have unsaved changes. Are you sure you want to create a new project?'
            );
            if (!confirmNew) return;
        }

        dispatch(resetProject());
        dispatch(clearNodes());
        dispatch(clearEdges());
        dispatch(clearSelection());
    };

    // const formatLastSaved = (lastSaved: string | null) => {
    //     if (!lastSaved) return 'Never saved';
    //     const date = new Date(lastSaved);
    //     return `Saved ${date.toLocaleTimeString()}`;
    // };

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: 1,
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="toggle sidebar"
                    onClick={onMenuToggle}
                    edge="start"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 0,
                        mr: 3,
                        fontWeight: 'bold',
                        color: 'primary.main'
                    }}
                >
                    Project Planner POC
                </Typography>

                <TextField
                    label="Project Name"
                    value={projectName}
                    onChange={handleProjectNameChange}
                    size="small"
                    sx={{
                        width: 250,
                        mr: 2,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'background.default'
                        }
                    }}
                />

                {/* {isDirty && (
          <Chip 
            label="Unsaved" 
            color="warning" 
            size="small" 
            sx={{ mr: 2 }} 
          />
        )} */}

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
            {formatLastSaved(lastSaved)}
          </Typography> */}

                    <Button
                        startIcon={<FiberNew />}
                        onClick={handleNewProject}
                        size="small"
                        variant="outlined"
                    >
                        New
                    </Button>

                    <Button
                        startIcon={<FileUpload />}
                        onClick={(e) => setImportMenuAnchor(e.currentTarget)}
                        size="small"
                        variant="outlined"
                    >
                        Import
                    </Button>

                    <Button
                        startIcon={<FileDownload />}
                        onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                        size="small"
                        variant="outlined"
                    >
                        Export
                    </Button>
                </Box>

                {/* Export Menu */}
                <Menu
                    anchorEl={exportMenuAnchor}
                    open={Boolean(exportMenuAnchor)}
                    onClose={() => setExportMenuAnchor(null)}
                >
                    <MenuItem onClick={handleExportJSON}>
                        <Description sx={{ mr: 1 }} />
                        Export as JSON
                    </MenuItem>
                    <MenuItem onClick={handleExportImage}>
                        <Image sx={{ mr: 1 }} />
                        Export as Image
                    </MenuItem>
                </Menu>

                {/* Import Menu */}
                <Menu
                    anchorEl={importMenuAnchor}
                    open={Boolean(importMenuAnchor)}
                    onClose={() => setImportMenuAnchor(null)}
                >
                    <MenuItem onClick={() => fileInputRef.current?.click()}>
                        <Description sx={{ mr: 1 }} />
                        Import JSON Project
                    </MenuItem>
                </Menu>

                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportJSON}
                    accept=".json"
                    style={{ display: 'none' }}
                />
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;