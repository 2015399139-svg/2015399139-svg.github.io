import bpy

src = "/Users/zhuchengbin/Downloads/Blend_7277/Blend_7277/Blend_7277.blend"
out_glb = "/Users/zhuchengbin/Downloads/个人网页/public/models/blend-7277.glb"
out_jpg = "/Users/zhuchengbin/Downloads/个人网页/public/images/projects/studio/blend-7277.jpg"

bpy.ops.wm.open_mainfile(filepath=src)

# Instances → real meshes so GLB keeps the garden layout
bpy.ops.object.select_all(action="SELECT")
try:
    bpy.ops.object.duplicates_make_real()
except Exception as err:
    print("instances", err)

def fit_image(img, cap=1024):
    w, h = img.size
    if w < 2 or h < 2:
        return
    if max(w, h) <= cap:
        return
    scale = cap / float(max(w, h))
    img.scale(max(2, int(w * scale)), max(2, int(h * scale)))

for image in bpy.data.images:
    name = image.name.lower()
    if name.endswith(".hdr") or "hdr" in name:
        continue
    cap = 512 if ("normal" in name or "norm" in name) else 1024
    try:
        fit_image(image, cap)
    except Exception as err:
        print("scale fail", image.name, err)

import os

os.makedirs(os.path.dirname(out_glb), exist_ok=True)
os.makedirs(os.path.dirname(out_jpg), exist_ok=True)

bpy.ops.export_scene.gltf(
    filepath=out_glb,
    export_format="GLB",
    export_image_format="JPEG",
    export_jpeg_quality=72,
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=7,
    export_cameras=False,
    export_lights=True,
    export_extras=False,
    export_apply=True,
    export_unused_images=False,
)

scene = bpy.context.scene
engine = "BLENDER_EEVEE_NEXT"
if engine not in bpy.types.RenderSettings.bl_rna.properties["engine"].enum_items.keys():
    engine = "BLENDER_EEVEE"
scene.render.engine = engine
scene.render.filepath = out_jpg
scene.render.image_settings.file_format = "JPEG"
scene.render.image_settings.quality = 86
scene.render.resolution_x = 1600
scene.render.resolution_y = 1200
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
try:
    bpy.ops.render.render(write_still=True)
    print("RENDER_OK", out_jpg)
except Exception as err:
    print("RENDER_FAIL", err)

print("GLB_OK", out_glb)
print("GLB_SIZE", os.path.getsize(out_glb) if os.path.exists(out_glb) else 0)
