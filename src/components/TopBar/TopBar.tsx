import React, { useRef, useState } from 'react';
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
} from '@mui/material';
import ConfirmDialog from '../common/ConfirmDialog';
import {
    FileDownload,
    FileUpload,
    Image,
    Description,
    FiberNew
} from '@mui/icons-material';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import { saveAs } from 'file-saver';
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

                if (!projectData.nodes || !projectData.edges) {
                    alert('Invalid project file format. Missing nodes or edges data.');
                    return;
                }

                dispatch(clearNodes());
                dispatch(clearEdges());
                dispatch(clearSelection());

                dispatch(loadProject({
                    projectName: projectData.projectName || 'Imported Project',
                    lastSaved: projectData.exportedAt
                }));

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


    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const handleNewProject = () => {
        if (isDirty) {
            setConfirmDialogOpen(true);
            return;
        }
        doNewProject();
    };

    const doNewProject = () => {
        dispatch(resetProject());
        dispatch(clearNodes());
        dispatch(clearEdges());
        dispatch(clearSelection());
    };

    return (
        <>
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
                        color="info"
                        aria-label="toggle sidebar"
                        onClick={onMenuToggle}
                        edge="start"
                        sx={{ mr: 2 }}
                    >
                        <ViewSidebarIcon />
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

                    <Box sx={{ flexGrow: 1 }} />

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            <ConfirmDialog
                open={confirmDialogOpen}
                title="Unsaved Changes"
                message="You have unsaved changes. Are you sure you want to create a new project?"
                onClose={() => setConfirmDialogOpen(false)}
                onConfirm={() => {
                    setConfirmDialogOpen(false);
                    doNewProject();
                }}
            />
        </>
    );
};

export default TopBar;